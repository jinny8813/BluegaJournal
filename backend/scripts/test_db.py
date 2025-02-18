import os
import sys
import django
from pathlib import Path

# 設置 Django 設定模組
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')

# 獲取專案根目錄
BASE_DIR = Path(__file__).resolve().parent.parent

# 將專案根目錄添加到 Python 路徑
sys.path.insert(0, str(BASE_DIR))

# 初始化 Django
django.setup()

# 現在可以安全地導入 Django 設定
from django.conf import settings
import psycopg2

def test_db():
    try:
        conn = psycopg2.connect(
            dbname=settings.DATABASES['default']['NAME'],
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT']
        )
        print("成功連接到資料庫！")
        
        # 測試查詢
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"PostgreSQL 版本: {version[0]}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"連接失敗：{e}")

if __name__ == "__main__":
    test_db()