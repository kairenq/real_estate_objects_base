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
│   │   └── main.py        # Главный файл приложения
│   ├── init_db.py         # Инициализация БД
│   ├── run.py             # Запуск сервера
│   └── requirements.txt   # Зависимости Python
├── frontend/
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── context/       # Context API
│   │   ├── pages/         # Страницы приложения
│   │   ├── services/      # API сервисы
│   │   ├── types/         # TypeScript типы
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
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
