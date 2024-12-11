# 開發環境
FROM python:3.10

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

# 創建非 root 用戶並設置權限
RUN adduser --disabled-password --no-create-home app && \
    mkdir -p /app/media /app/static && \
    chown -R app:app /app

COPY --chown=app:app . .

USER app

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]