FROM nginx:alpine

# 移除默認的 nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 複製自定義配置
COPY conf.d/dev.conf /etc/nginx/conf.d/

# 創建必要的目錄
RUN mkdir -p /app/staticfiles /app/media

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]