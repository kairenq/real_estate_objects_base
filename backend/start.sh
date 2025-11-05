#!/bin/bash

# Инициализация базы данных
python init_db.py

# Запуск сервера
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
