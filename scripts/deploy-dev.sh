#!/bin/bash
set -e

echo "Starting development deployment..."

# 設置環境變量
export COMPOSE_FILE=docker/dev/docker-compose.yml
export ENV=dev

# 停止現有服務
docker-compose -f $COMPOSE_FILE down || true

# 清理 Docker 資源
docker system prune -f

# 更新代碼
git fetch origin
git reset --hard origin/develop

# 驗證必要文件
for file in .env.dev $COMPOSE_FILE; do
  if [ ! -f "$file" ]; then
    echo "Error: $file not found!"
    exit 1
  fi
done

# 構建和啟動服務
docker-compose -f $COMPOSE_FILE up -d --build --force-recreate

# 等待數據庫就緒
sleep 10

# 執行數據庫遷移
for i in {1..5}; do
  if docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate; then
    echo "Migrations completed successfully"
    break
  fi
  
  if [ $i -eq 5 ]; then
    echo "Migration failed after 5 attempts"
    exit 1
  fi
  
  echo "Migration attempt $i failed, retrying in 10 seconds..."
  sleep 10
done

echo "Development deployment completed successfully!"