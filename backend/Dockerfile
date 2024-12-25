# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements/base.txt requirements/base.txt
COPY requirements/local.txt requirements/local.txt

RUN pip install -r requirements/local.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]