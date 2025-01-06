# frontend/Dockerfile
FROM node:18

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:8000

# 暴露端口
EXPOSE 5173

# 啟動開發服務器
CMD ["npm", "run", "dev"]