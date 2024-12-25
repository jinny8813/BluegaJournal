# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 暴露端口
EXPOSE 5173

# 啟動開發服務器
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]