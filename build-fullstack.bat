@echo off
title Сборка Full-Stack приложения
color 0B

echo ============================================
echo   Сборка Full-Stack приложения
echo ============================================
echo.

REM Backend
echo [1/3] Установка backend зависимостей...
cd backend

if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
cd ..

echo.
echo [2/3] Сборка frontend...
cd frontend
call npm install
set VITE_API_URL=/api
call npm run build
cd ..

echo.
echo [3/3] Готово!
echo.
echo Для запуска локально:
echo   cd backend
echo   venv\Scripts\activate
echo   python run.py
echo.
echo Откройте: http://localhost:8000
echo.
pause
