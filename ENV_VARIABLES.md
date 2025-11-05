# 🔐 Environment Variables

## Backend (Render)

Добавьте эти переменные в Render Dashboard → Environment:

```env
# Обязательные
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./real_estate.db
PYTHON_VERSION=3.11.0

# После деплоя frontend добавьте:
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
```

### Как сгенерировать SECRET_KEY:

**Вариант 1 - Python:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Вариант 2 - OpenSSL:**
```bash
openssl rand -base64 32
```

**Вариант 3 - Онлайн:**
Используйте [generate.plus](https://generate.plus/en/base64)

---

## Frontend (Netlify)

Добавьте эту переменную в Netlify Site settings → Environment variables:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**ВАЖНО**: Замените `your-backend-url` на реальный URL вашего API из Render!

---

## Локальная разработка

### Backend

Создайте файл `backend/.env`:

```env
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./real_estate.db
```

### Frontend

Создайте файл `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

⚠️ **НЕ коммитьте файлы `.env` и `.env.local` в Git!**

---

## Проверка переменных

### Backend

После установки переменных на Render, проверьте в логах:

```
Starting service...
Environment variables loaded ✓
```

### Frontend

После установки переменных на Netlify, пересоберите сайт:

1. Deploys → Trigger deploy
2. Clear cache and deploy site

---

## Траблшутинг

### Backend не видит переменные

1. Перепроверьте названия переменных (case-sensitive)
2. Убедитесь, что нет лишних пробелов
3. Перезапустите сервис: Settings → Manual Deploy

### Frontend не видит API URL

1. Переменная должна начинаться с `VITE_`
2. Пересоберите сайт после добавления переменных
3. Проверьте в build logs:
   ```
   VITE_API_URL is set to: https://...
   ```

### CORS ошибки

Убедитесь, что:
1. `ALLOWED_ORIGINS` содержит URL вашего Netlify сайта
2. В `ALLOWED_ORIGINS` нет протокола с ошибками (https vs http)
3. URL не содержит trailing slash (/)

Правильно:
```
ALLOWED_ORIGINS=https://my-site.netlify.app,http://localhost:3000
```

Неправильно:
```
ALLOWED_ORIGINS=https://my-site.netlify.app/,http://localhost:3000/
```

---

## Безопасность

✅ **DO:**
- Используйте разные `SECRET_KEY` для dev и production
- Храните секреты в environment variables, не в коде
- Регулярно ротируйте секретные ключи
- Используйте сильные случайные ключи (минимум 32 байта)

❌ **DON'T:**
- Не коммитьте `.env` файлы
- Не используйте простые ключи типа "secret123"
- Не храните ключи в коде
- Не делитесь ключами публично

---

## Production checklist

Перед запуском в продакшн убедитесь:

- [ ] `SECRET_KEY` - случайная строка минимум 32 символа
- [ ] `ALLOWED_ORIGINS` содержит только нужные домены
- [ ] `VITE_API_URL` указывает на production API
- [ ] Все `.env` файлы в `.gitignore`
- [ ] Backend использует HTTPS URL
- [ ] Frontend использует HTTPS URL
- [ ] Тестовые пароли изменены
