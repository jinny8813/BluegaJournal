FROM nginx:alpine

# 安裝 wget 用於健康檢查
RUN apk add --no-cache wget

# 複製配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 創建必要的目錄並設置權限
RUN mkdir -p /usr/share/nginx/static \
    && mkdir -p /usr/share/nginx/media \
    && mkdir -p /usr/share/nginx/html \
    && chown -R nginx:nginx /usr/share/nginx \
    && chmod -R 755 /usr/share/nginx

# 設置工作目錄
WORKDIR /usr/share/nginx/html

# 使用非 root 用戶運行
USER nginx