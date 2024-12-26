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

# 停止現有服務
docker-compose -f $COMPOSE_FILE down || true

# 清理 Docker 資源
docker system prune -f

# 構建新鏡像
docker-compose -f $COMPOSE_FILE build

# 啟動服務
docker-compose -f $COMPOSE_FILE up -d

# 等待數據庫就緒
echo "Waiting for database to be ready..."
sleep 20

# 執行數據庫遷移
echo "Running database migrations..."
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate

# 收集靜態文件
echo "Collecting static files..."
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py collectstatic --noinput

echo "Deployment completed!"

# 檢查服務狀態
docker-compose -f $COMPOSE_FILE ps

# 檢查健康狀態
echo "Checking application health..."
curl -s http://localhost/health_check || echo "Health check failed"