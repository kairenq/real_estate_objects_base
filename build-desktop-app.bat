@echo off
title Сборка десктопного приложения (.exe)
color 0B

echo ============================================
echo   Сборка десктопного приложения
echo ============================================
echo.

cd electron

echo [1/2] Установка зависимостей...
call npm install
echo.

echo [2/2] Сборка Windows .exe...
echo Это может занять несколько минут...
echo.

call npm run build:win

echo.
echo ============================================
echo   Сборка завершена!
echo ============================================
echo.
echo Файл установщика находится в:
echo electron\dist\
echo.
echo Файл: База Недвижимости Setup [версия].exe
echo.
pause
