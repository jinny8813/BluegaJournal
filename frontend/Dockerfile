# 構建階段
FROM node:18 as build

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 特別安裝 TailwindCSS 和相關依賴
RUN npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# 特別安裝測試相關依賴
RUN npm install --save-dev \
    @testing-library/react \
    @testing-library/jest-dom \
    @testing-library/user-event \
    jest \
    jest-environment-jsdom \
    @babel/preset-react \
    @babel/preset-env \
    identity-obj-proxy

# 複製源代碼
COPY . .

# 設置環境變量
ENV VITE_API_URL=http://localhost:8000/api

# 暴露端口
EXPOSE 5173

# 啟動開發服務器
CMD ["npm", "run", "dev"]