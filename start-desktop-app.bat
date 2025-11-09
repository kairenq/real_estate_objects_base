@echo off
title Запуск десктопного приложения
color 0B

echo ============================================
echo   База Недвижимости - Десктопное приложение
echo ============================================
echo.

cd electron

if not exist "node_modules" (
    echo [1/2] Установка зависимостей...
    call npm install
    echo.
)

echo [2/2] Запуск приложения...
echo.
echo ВАЖНО: Убедитесь, что вы обновили URL в electron/main.js
echo на актуальный адрес вашего приложения на Render!
echo.

call npm start
