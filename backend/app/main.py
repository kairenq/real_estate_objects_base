import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database.database import engine, Base
from app.routes import auth, users, real_estate
from app.models import User, RealEstateObject

# Создание таблиц в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Real Estate Management System",
    description="API для управления базой объектов недвижимости",
    version="1.0.0"
)

# Получаем список разрешенных origins из переменной окружения
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# CORS middleware для разрешения запросов с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров API
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(real_estate.router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


# Путь к собранному frontend
FRONTEND_DIST = Path(__file__).parent.parent.parent / "frontend" / "dist"

# Проверяем есть ли собранный frontend
if FRONTEND_DIST.exists() and FRONTEND_DIST.is_dir():
    # Раздаём статические файлы (JS, CSS, изображения)
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    # Catch-all route для SPA (должен быть последним!)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Раздаём index.html для всех не-API роутов (SPA)"""
        # Если запрашивается файл и он существует - отдаём его
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        # Иначе отдаём index.html (для React Router)
        index_path = FRONTEND_DIST / "index.html"
        if index_path.exists():
            return FileResponse(index_path)

        return {"message": "Frontend not built. Run: cd frontend && npm run build"}
else:
    @app.get("/")
    def read_root():
        return {
            "message": "Welcome to Real Estate Management System API",
            "docs": "/docs",
            "redoc": "/redoc",
            "note": "Frontend not built. Run: cd frontend && npm run build"
        }
