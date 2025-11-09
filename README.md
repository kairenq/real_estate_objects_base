# База объектов недвижимости

Информационная система для управления объектами недвижимости с веб-интерфейсом.

## Технологии

### Backend
- **FastAPI** - современный веб-фреймворк
- **SQLite** - база данных
- **SQLAlchemy** - ORM
- **JWT** - аутентификация
- **Pydantic** - валидация данных

### Frontend
- **React** - библиотека для создания UI
- **TypeScript** - типизированный JavaScript
- **Material-UI (MUI)** - современные UI компоненты
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

## Возможности

### Для всех пользователей:
- Просмотр каталога объектов недвижимости
- Фильтрация по городу, типу, цене
- Регистрация и авторизация

### Для авторизованных пользователей:
- Создание объявлений о недвижимости
- Редактирование своих объявлений
- Удаление своих объявлений

### Для администраторов:
- Управление всеми пользователями
- Управление всеми объектами недвижимости
- Просмотр статистики

## Установка и запуск

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Инициализируйте базу данных:
```bash
python init_db.py
```

5. Запустите сервер:
```bash
python run.py
```

Сервер запустится на http://localhost:8000

API документация доступна по адресу: http://localhost:8000/docs

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm run dev
```

Приложение откроется на http://localhost:3000

## 🚀 Деплой в продакшн на Render

Проект настроен для **унифицированного деплоя** на Render (backend + frontend вместе).

**Быстрый старт**: см. [QUICK_DEPLOY.md](QUICK_DEPLOY.md) (10 минут)

**Подробный гайд**: см. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Как это работает:

1. **Единый Web Service на Render**:
   - FastAPI собирает и раздаёт статические файлы frontend
   - Используется `render.yaml` для автоматической настройки
   - При сборке устанавливается Node.js и собирается React
   - API доступен по `/api/*`, frontend - по всем остальным путям

2. **Автоматический деплой**:
   - Push в GitHub → автоматическая сборка на Render
   - Не нужно настраивать CORS между доменами
   - Всё работает на одном домене

3. **Локальная сборка** (опционально):
   - Windows: `build-fullstack.bat`
   - Linux/macOS: `./build-fullstack.sh`

## 🖥️ Десктопное приложение (Electron)

Кроме веб-версии, доступно полноценное **десктопное приложение** для Windows, macOS и Linux.

### Быстрый запуск:

**Windows:**
```bash
start-desktop-app.bat
```

**Linux/macOS:**
```bash
cd electron && npm install && npm start
```

### Сборка установщика:

**Windows:**
```bash
build-desktop-app.bat
```

Готовый `.exe` будет в `electron/dist/`

### Автоматическая сборка через GitHub Actions:

- При push в `main` - создаётся артефакт с .exe
- При создании тега (например `v1.0.0`) - создаётся Release

**Подробнее**: см. [electron/README.md](electron/README.md)

## Тестовые учетные данные

После инициализации базы данных доступны следующие учетные записи:

**Администратор:**
- Username: `admin`
- Password: `admin123`

**Обычный пользователь:**
- Username: `user`
- Password: `user123`

## Структура проекта

```
real_estate_objects_base/
├── backend/
│   ├── app/
│   │   ├── core/          # Конфигурация и безопасность
│   │   ├── database/      # Подключение к БД
│   │   ├── models/        # Модели SQLAlchemy
│   │   ├── routes/        # API endpoints
│   │   ├── schemas/       # Pydantic схемы
│   │   └── main.py        # Главный файл приложения (+ раздача static)
│   ├── init_db.py         # Инициализация БД
│   ├── run.py             # Запуск сервера
│   └── requirements.txt   # Зависимости Python
├── frontend/
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── context/       # Context API (Auth, Theme)
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API сервисы
│   │   ├── theme/         # Material-UI тема (light/dark)
│   │   ├── types/         # TypeScript типы
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── electron/              # Десктопное приложение
│   ├── main.js            # Главный процесс Electron
│   ├── package.json       # Конфигурация и зависимости
│   └── README.md          # Документация desktop app
├── .github/
│   └── workflows/
│       └── build-desktop.yml  # Автосборка .exe
├── render.yaml            # Конфигурация Render (fullstack)
├── build-fullstack.bat    # Скрипт сборки для Windows
├── build-fullstack.sh     # Скрипт сборки для Linux/macOS
├── start-desktop-app.bat  # Запуск desktop app (Windows)
├── build-desktop-app.bat  # Сборка .exe (Windows)
└── README.md
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить текущего пользователя

### Пользователи (только для админов)
- `GET /api/users/` - Список всех пользователей
- `GET /api/users/{id}` - Получить пользователя
- `PUT /api/users/{id}` - Обновить пользователя
- `DELETE /api/users/{id}` - Удалить пользователя

### Объекты недвижимости
- `GET /api/real-estate/` - Список объектов (с фильтрами)
- `GET /api/real-estate/{id}` - Получить объект
- `POST /api/real-estate/` - Создать объект (требуется авторизация)
- `PUT /api/real-estate/{id}` - Обновить объект
- `DELETE /api/real-estate/{id}` - Удалить объект
- `GET /api/real-estate/my/objects` - Мои объекты

## Лицензия

MIT
