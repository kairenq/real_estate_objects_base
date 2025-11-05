import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Подключение роутеров
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(real_estate.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Real Estate Management System API",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
