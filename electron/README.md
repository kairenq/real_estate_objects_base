# Real Estate Desktop - Десктопное Приложение

Electron-приложение для системы управления недвижимостью (База Недвижимости).

## 🚀 Быстрый старт

### Запуск в режиме разработки

**Windows:**
```bash
# Из корневой папки проекта
start-desktop-app.bat
```

**Linux/macOS:**
```bash
cd electron
npm install
npm start
```

### Сборка .exe установщика

**Windows:**
```bash
# Из корневой папки проекта
build-desktop-app.bat
```

**Вручную:**
```bash
cd electron
npm install
npm run build:win
```

Готовый установщик будет в папке `electron/dist/`

## ⚙️ Конфигурация

### Настройка URL сервера

По умолчанию приложение подключается к `https://real-estate-objects-base.onrender.com`

**Чтобы изменить URL:**

1. Откройте файл `electron/main.js`
2. Найдите строку:
   ```javascript
   const APP_URL = process.env.APP_URL || 'https://real-estate-objects-base.onrender.com';
   ```
3. Замените URL на нужный адрес
4. Сохраните и пересоберите приложение

**Или используйте переменную окружения:**
```bash
set APP_URL=https://your-custom-url.com
npm start
```

## 📦 Автоматическая сборка через GitHub Actions

При push в ветку `main`, `claude/*` или создании тега:

1. GitHub Actions автоматически соберет .exe файл
2. Файл будет доступен в разделе **Actions** → **Artifacts**
3. При создании тега (например, `v1.0.0`) создастся Release с .exe

### Скачивание готового .exe:
1. Зайдите в **Actions** → последний успешный build
2. Скачайте артефакт **Real-Estate-Desktop-Windows**
3. Распакуйте .zip и запустите установщик

### Ручной запуск сборки:
Перейдите в **Actions** → **Build Desktop Application** → **Run workflow**

### Создание релиза:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 🔧 Команды npm

- `npm start` - Запуск в режиме разработки
- `npm run build:win` - Сборка для Windows
- `npm run build:mac` - Сборка для macOS
- `npm run build:linux` - Сборка для Linux

## 📝 Структура проекта

```
electron/
├── main.js           # Главный процесс Electron
├── package.json      # Конфигурация и зависимости
├── icon.png          # Иконка приложения (опционально)
└── dist/             # Собранные установщики
```

## 🎨 Особенности

- ✅ Подключение к облачному серверу на Render
- ✅ Красивая страница ошибки при отсутствии соединения
- ✅ Полноценное меню приложения на русском языке
- ✅ Горячие клавиши (F5 - обновить, F11 - полный экран, F12 - DevTools)
- ✅ Автоматическая сборка через GitHub Actions
- ✅ NSIS установщик для Windows
- ✅ Отключена подпись кода (можно включить при необходимости)

## 🔒 Безопасность

Приложение использует следующие настройки безопасности:
- `nodeIntegration: false` - Node.js API недоступен в renderer
- `contextIsolation: true` - Изоляция контекста
- `enableRemoteModule: false` - Remote модуль отключен
- `webSecurity: true` - Web безопасность включена

## 🐛 Отладка

Откройте DevTools клавишей **F12** или через меню **Вид** → **Инструменты разработчика**

## 📄 Лицензия

MIT
