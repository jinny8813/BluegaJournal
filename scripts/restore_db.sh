#!/bin/bash

# 使用方法：./restore_db.sh backup_file.sql
if [ -z "$1" ]; then
    echo "請指定備份文件"
    exit 1
fi

DB_CONTAINER="bluega_db_prod"
DB_NAME="bluega_journal_prod"
DB_USER="postgres"

# 恢復數據
if [[ $1 == *.gz ]]; then
    gunzip -c $1 | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME
else
    cat $1 | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME
fi