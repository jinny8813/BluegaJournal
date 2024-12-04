FROM nginx:alpine

# 安裝 wget
RUN apk add --no-cache wget

# 創建必要的目錄
RUN mkdir -p /var/cache/nginx \
    && mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && mkdir -p /usr/share/nginx/html \
    && mkdir -p /usr/share/nginx/static \
    && mkdir -p /usr/share/nginx/media

# 設置權限
RUN chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /usr/share/nginx

# 創建自定義 nginx.conf
RUN echo 'user nginx;' > /etc/nginx/nginx.conf \
    && echo 'worker_processes auto;' >> /etc/nginx/nginx.conf \
    && echo 'pid /var/run/nginx.pid;' >> /etc/nginx/nginx.conf \
    && echo 'events {' >> /etc/nginx/nginx.conf \
    && echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf \
    && echo '}' >> /etc/nginx/nginx.conf \
    && echo 'http {' >> /etc/nginx/nginx.conf \
    && echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf \
    && echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf \
    && echo '    access_log /var/log/nginx/access.log combined;' >> /etc/nginx/nginx.conf \
    && echo '    error_log /var/log/nginx/error.log warn;' >> /etc/nginx/nginx.conf \
    && echo '    sendfile on;' >> /etc/nginx/nginx.conf \
    && echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf \
    && echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf \
    && echo '}' >> /etc/nginx/nginx.conf

# 複製配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 創建一個測試文件用於健康檢查
RUN echo "healthy" > /usr/share/nginx/html/health_check.html

# 使用 root 用戶運行
USER root

# 設置工作目錄
WORKDIR /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 啟動命令
CMD ["nginx", "-g", "daemon off;"]