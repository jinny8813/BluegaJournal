# 構建階段
FROM node:18 as build

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 設置環境變量
ENV VITE_API_URL=http://localhost:8000/api

# 暴露端口
EXPOSE 5173

# 啟動開發服務器
CMD ["npm", "run", "dev"]