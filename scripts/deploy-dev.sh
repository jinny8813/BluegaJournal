#!/bin/bash
set -e

echo "Starting development deployment..."

# 設置工作目錄
cd ~/BluegaJournalDev

# 設置環境變量
export COMPOSE_FILE=docker/dev/docker-compose.yml
export ENV=dev

# 確保目錄存在
mkdir -p docker/dev
mkdir -p nginx/conf.d

# 停止並移除現有容器
echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down -v

# 清理 Docker 資源
echo "Cleaning Docker resources..."
docker system prune -f

# 確保網絡存在
echo "Setting up Docker network..."
docker network prune -f
docker network create dev_network 2>/dev/null || true

# 構建新鏡像
echo "Building new images..."
docker-compose -f $COMPOSE_FILE build

# 啟動服務
echo "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# 等待數據庫就緒
echo "Waiting for database to be ready..."
for i in {1..30}; do
    if docker-compose -f $COMPOSE_FILE exec -T db pg_isready -U postgres; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting for database... ($i/30)"
    sleep 2
done

# 顯示容器狀態
echo "Container status:"
docker-compose -f $COMPOSE_FILE ps

# 顯示數據庫日誌
echo "Database logs:"
docker-compose -f $COMPOSE_FILE logs db

# 顯示後端日誌
echo "Backend logs:"
docker-compose -f $COMPOSE_FILE logs backend

# 執行數據庫遷移（添加錯誤處理）
echo "Running database migrations..."
if ! docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate; then
    echo "Migration failed. Checking database connection..."
    docker-compose -f $COMPOSE_FILE exec -T backend python -c "
import os
import psycopg2
try:
    conn = psycopg2.connect(
        dbname=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT')
    )
    print('Database connection successful')
    conn.close()
except Exception as e:
    print('Database connection failed:', str(e))
"
    # 顯示環境變量
    echo "Environment variables:"
    docker-compose -f $COMPOSE_FILE exec -T backend env
    
    # 如果還是失敗，退出
    exit 1
fi

# 收集靜態文件
echo "Collecting static files..."
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py collectstatic --noinput

echo "Deployment completed!"

# 檢查服務狀態
docker-compose -f $COMPOSE_FILE ps

# 檢查健康狀態
echo "Checking application health..."
curl -s http://localhost:8081/health_check || echo "Health check failed"

# 顯示所有容器的日誌
echo "All container logs:"
docker-compose -f $COMPOSE_FILE logs