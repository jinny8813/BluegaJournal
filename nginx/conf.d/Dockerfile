FROM nginx:alpine

# 移除默認配置
RUN rm /etc/nginx/conf.d/default.conf

# 複製配置文件
COPY conf.d/ /etc/nginx/conf.d/

# 創建必要的目錄
RUN mkdir -p /app/staticfiles /app/media

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/health_check || exit 1