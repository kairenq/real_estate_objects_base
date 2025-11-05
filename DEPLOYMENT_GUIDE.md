# 🚀 Гайд по деплою на Render + Netlify

Этот гайд поможет вам развернуть приложение "База объектов недвижимости" в продакшн.

## 📋 Что вам понадобится

1. Аккаунт на [Render.com](https://render.com) (бесплатный)
2. Аккаунт на [Netlify.com](https://netlify.com) (бесплатный)
3. Ваш GitHub репозиторий с кодом

---

## 🔧 Часть 1: Деплой Backend на Render

### Шаг 1: Подготовка репозитория

Убедитесь, что все изменения закоммичены и запушены в ваш GitHub репозиторий:

```bash
git add .
git commit -m "Подготовка к деплою"
git push origin main
```

### Шаг 2: Создание Web Service на Render

1. Перейдите на [dashboard.render.com](https://dashboard.render.com)
2. Нажмите **"New +"** → **"Web Service"**
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий `real_estate_objects_base`

### Шаг 3: Настройка Web Service

Заполните следующие поля:

**Basic Settings:**
- **Name**: `real-estate-api` (или любое другое имя)
- **Region**: `Frankfurt (EU Central)` (или ближайший к вам)
- **Branch**: `main` (или ваша основная ветка)
- **Root Directory**: Оставьте пустым
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**:
  ```bash
  cd backend && pip install -r requirements.txt
  ```

- **Start Command**:
  ```bash
  cd backend && python init_db.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Выберите **"Free"** (для тестирования)

### Шаг 4: Environment Variables

Нажмите **"Advanced"** и добавьте следующие переменные окружения:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Сгенерируйте случайный ключ (можно использовать [generate.plus](https://generate.plus/en/base64)) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `DATABASE_URL` | `sqlite:///./real_estate.db` |
| `ALLOWED_ORIGINS` | Оставьте пустым пока (добавим после деплоя frontend) |
| `PYTHON_VERSION` | `3.11.0` |

### Шаг 5: Запуск деплоя

1. Нажмите **"Create Web Service"**
2. Дождитесь завершения деплоя (обычно 5-10 минут)
3. После успешного деплоя вы увидите URL вашего API, например:
   ```
   https://real-estate-api-xxxx.onrender.com
   ```

### Шаг 6: Проверка API

Откройте в браузере:
```
https://your-api-url.onrender.com/docs
```

Вы должны увидеть Swagger UI документацию вашего API.

---

## 🎨 Часть 2: Деплой Frontend на Netlify

### Шаг 1: Создание нового сайта на Netlify

1. Перейдите на [app.netlify.com](https://app.netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите **"Deploy with GitHub"**
4. Авторизуйте Netlify для доступа к GitHub
5. Выберите репозиторий `real_estate_objects_base`

### Шаг 2: Настройка Build Settings

**Site settings:**
- **Branch to deploy**: `main`
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### Шаг 3: Environment Variables

Нажмите **"Show advanced"** → **"New variable"** и добавьте:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-api-url.onrender.com/api` |

⚠️ **ВАЖНО**: Замените `your-api-url.onrender.com` на реальный URL вашего API из Render!

### Шаг 4: Запуск деплоя

1. Нажмите **"Deploy site"**
2. Дождитесь завершения сборки (обычно 2-5 минут)
3. После успешного деплоя вы получите URL, например:
   ```
   https://amazing-site-name.netlify.app
   ```

---

## 🔗 Часть 3: Связываем Backend и Frontend

### Обновление CORS на Backend

1. Вернитесь в Render Dashboard
2. Откройте ваш Web Service
3. Перейдите в **"Environment"**
4. Найдите или добавьте переменную `ALLOWED_ORIGINS`
5. Установите значение:
   ```
   https://your-netlify-site.netlify.app,http://localhost:3000
   ```
   (Замените на ваш реальный Netlify URL)

6. Сохраните изменения
7. Render автоматически перезапустит ваш сервис

### Проверка работы

1. Откройте ваш сайт на Netlify: `https://your-site.netlify.app`
2. Попробуйте зарегистрироваться или войти с тестовыми данными:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 🎯 Часть 4: Финальная настройка

### Настройка кастомного домена (опционально)

#### На Netlify:
1. Перейдите в **"Site settings"** → **"Domain management"**
2. Нажмите **"Add custom domain"**
3. Следуйте инструкциям для настройки DNS

#### На Render:
1. Перейдите в **"Settings"** → **"Custom Domains"**
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям

### Обновление имени сайта на Netlify

1. Перейдите в **"Site settings"** → **"Site details"**
2. Нажмите **"Change site name"**
3. Выберите удобное имя

---

## 🐛 Часть 5: Траблшутинг

### Backend не запускается

**Проблема**: Ошибка при установке зависимостей

**Решение**:
1. Проверьте логи в Render Dashboard
2. Убедитесь, что `requirements.txt` корректный
3. Проверьте версию Python (должна быть 3.11+)

**Проблема**: Database не инициализируется

**Решение**:
- На Render бесплатный план использует эфемерное хранилище
- База данных будет пересоздаваться при каждом перезапуске
- Для продакшна рекомендуется использовать PostgreSQL

### Frontend не подключается к API

**Проблема**: CORS ошибки

**Решение**:
1. Проверьте переменную `ALLOWED_ORIGINS` на Render
2. Убедитесь, что URL Netlify добавлен в список
3. Проверьте, что в переменной нет лишних пробелов

**Проблема**: 404 на маршрутах

**Решение**:
- Убедитесь, что файл `netlify.toml` находится в директории `frontend/`
- Проверьте настройки redirects в Netlify Dashboard

**Проблема**: Environment variables не работают

**Решение**:
1. Пересоберите сайт: **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**
2. Проверьте, что переменные начинаются с `VITE_` (для Vite)

---

## 📊 Мониторинг и логи

### Просмотр логов Backend (Render)

1. Откройте ваш Web Service на Render
2. Перейдите на вкладку **"Logs"**
3. Здесь вы увидите все логи сервера в реальном времени

### Просмотр логов Frontend (Netlify)

1. Откройте ваш сайт на Netlify
2. Перейдите в **"Deploys"**
3. Выберите деплой и нажмите на него
4. Нажмите **"Deploy log"** для просмотра логов сборки

### Мониторинг производительности

- **Render**: Автоматически показывает метрики CPU и Memory
- **Netlify**: Показывает статистику трафика и build times

---

## 💡 Полезные советы

### Автоматический деплой

Оба сервиса настроены на автоматический деплой при push в GitHub:
- Просто сделайте `git push` в основную ветку
- Render и Netlify автоматически пересоберут приложение

### Откат к предыдущей версии

**На Render:**
- Нажмите **"Manual Deploy"** → **"Deploy previous commit"**

**На Netlify:**
- Перейдите в **"Deploys"**
- Найдите нужный деплой
- Нажмите **"Publish deploy"**

### Переменные окружения для разных окружений

Вы можете создать разные branch для staging и production:
- `main` → production
- `develop` → staging

И настроить отдельные сервисы на Render/Netlify для каждого окружения.

---

## 🔒 Безопасность

### Важные рекомендации:

1. **Никогда не коммитьте `.env` файлы** с реальными секретами
2. **Используйте сложный `SECRET_KEY`** для JWT токенов
3. **Регулярно обновляйте зависимости**
4. **Для продакшна используйте PostgreSQL** вместо SQLite
5. **Включите HTTPS** (автоматически на Render и Netlify)

---

## 📈 Масштабирование

### Для большей производительности:

**На Render:**
- Обновите план до Paid tier для dedicated resources
- Добавьте PostgreSQL database
- Настройте Redis для кеширования

**На Netlify:**
- Pro план дает больше build minutes
- Enterprise для custom rules и SLA

---

## 🎉 Готово!

Теперь ваше приложение доступно онлайн:
- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-api.onrender.com`
- **API Docs**: `https://your-api.onrender.com/docs`

### Тестовые учетные данные:
- **Администратор**: username: `admin`, password: `admin123`
- **Пользователь**: username: `user`, password: `user123`

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Render и Netlify
2. Посмотрите [Render Docs](https://render.com/docs)
3. Посмотрите [Netlify Docs](https://docs.netlify.com)
4. Проверьте переменные окружения
5. Убедитесь, что все URL правильные

---

## 🔄 Быстрая шпаргалка

### Команды для локальной разработки:

```bash
# Backend
cd backend
source venv/bin/activate
python run.py

# Frontend
cd frontend
npm run dev
```

### Пуш изменений в продакшн:

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```

Render и Netlify автоматически развернут обновления!

---

**Удачного деплоя! 🚀**
