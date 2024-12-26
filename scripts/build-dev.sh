#!/bin/bash
set -e

echo "Building development environment..."

# 設置環境變量
export COMPOSE_FILE=docker/dev/docker-compose.yml
export ENV=dev

# 停止現有服務
docker-compose -f $COMPOSE_FILE down

# 構建新鏡像
docker-compose -f $COMPOSE_FILE build

# 啟動服務
docker-compose -f $COMPOSE_FILE up -d

# 等待數據庫就緒
sleep 10

# 執行數據庫遷移
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate

# 收集靜態文件
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py collectstatic --noinput

# 構建前端
docker-compose -f $COMPOSE_FILE exec -T frontend npm run build

echo "Development environment is ready!"