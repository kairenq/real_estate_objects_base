# ⚡ Быстрый гайд по деплою

## 1️⃣ Деплой Backend на Render (5 минут)

1. Зайти на [render.com](https://render.com) → **New** → **Web Service**
2. Подключить GitHub репозиторий
3. Настройки:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python init_db.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Runtime**: `Python 3`
4. Environment Variables:
   ```
   SECRET_KEY=<случайная строка>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DATABASE_URL=sqlite:///./real_estate.db
   PYTHON_VERSION=3.11.0
   ```
5. **Create Web Service**
6. Скопировать URL: `https://ваш-сервис.onrender.com`

---

## 2️⃣ Деплой Frontend на Netlify (3 минуты)

1. Зайти на [netlify.com](https://netlify.com) → **Add new site**
2. Выбрать репозиторий
3. Настройки:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://ваш-сервис.onrender.com/api
   ```
5. **Deploy site**

---

## 3️⃣ Связать Frontend и Backend (1 минута)

Вернуться в Render → Environment Variables:
```
ALLOWED_ORIGINS=https://ваш-сайт.netlify.app,http://localhost:3000
```

Сохранить → Сервис автоматически перезапустится.

---

## ✅ Проверка

Открыть `https://ваш-сайт.netlify.app`

Войти:
- username: `admin`
- password: `admin123`

---

## 📝 Важно

- Заменить `<случайная строка>` на реальный SECRET_KEY
- Заменить URL в переменных окружения на реальные
- При push в GitHub - автоматический деплой

---

**Полный гайд**: см. `DEPLOYMENT_GUIDE.md`
