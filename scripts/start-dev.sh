#!/bin/bash

# 設置環境變量
export COMPOSE_FILE=docker/dev/docker-compose.yml
export DJANGO_SETTINGS_MODULE=config.settings.dev

# 停止現有服務
docker-compose down

# 構建新鏡像
docker-compose build

# 啟動服務
docker-compose up -d

# 執行數據庫遷移
docker-compose exec -T backend python manage.py migrate

# 收集靜態文件
docker-compose exec -T backend python manage.py collectstatic --noinput

# 清理舊的 Docker 鏡像
docker image prune -f

echo "部署完成"