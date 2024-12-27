#!/bin/bash

# 停止並移除所有現有容器
docker-compose -f docker/prod/docker-compose.yml down

# 移除所有未使用的容器、網絡和鏡像
docker system prune -f

# 構建並啟動新容器
docker-compose -f docker/prod/docker-compose.yml up -d --build

# 等待數據庫準備就緒
echo "Waiting for database to be ready..."
sleep 15

# 執行數據庫遷移
docker-compose -f docker/prod/docker-compose.yml exec -T backend python manage.py migrate

# 收集靜態文件
docker-compose -f docker/prod/docker-compose.yml exec -T backend python manage.py collectstatic --noinput

# 顯示容器狀態
docker-compose -f docker/prod/docker-compose.yml ps

echo "Deployment completed successfully!"