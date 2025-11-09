#!/bin/bash

echo "============================================"
echo "  Сборка Full-Stack приложения"
echo "============================================"
echo ""

# Backend
echo "[1/3] Установка backend зависимостей..."
cd backend
if [ ! -d "venv" ]; then
    python -m venv venv
fi

source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows (закомментировано)

pip install -r requirements.txt
python init_db.py
cd ..

echo ""
echo "[2/3] Сборка frontend..."
cd frontend
npm install
VITE_API_URL=/api npm run build
cd ..

echo ""
echo "[3/3] Готово!"
echo ""
echo "Для запуска локально:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
echo "Откройте: http://localhost:8000"
echo ""
