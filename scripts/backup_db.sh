#!/bin/bash

# 設置變數
BACKUP_DIR="/path/to/your/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_CONTAINER="bluega_db_prod"
DB_NAME="bluega_journal_prod"
DB_USER="postgres"

# 創建備份目錄
mkdir -p $BACKUP_DIR

# 執行備份
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

# 保留最近30天的備份，刪除更早的
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

# 可選：壓縮備份文件
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql