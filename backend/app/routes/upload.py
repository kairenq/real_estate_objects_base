from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
import os
import uuid
from pathlib import Path

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Папка для загрузки файлов
UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Разрешенные расширения
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/images", response_model=List[str])
async def upload_images(files: List[UploadFile] = File(...)):
    """Загрузка изображений"""
    uploaded_urls = []

    for file in files:
        # Проверка расширения
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Недопустимый формат файла. Разрешены: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Проверка размера
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Файл слишком большой. Максимум 5MB"
            )

        # Генерация уникального имени
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename

        # Сохранение файла
        with open(file_path, "wb") as f:
            f.write(content)

        # Возвращаем URL
        uploaded_urls.append(f"/static/uploads/{unique_filename}")

    return uploaded_urls


@router.delete("/images")
async def delete_image(image_url: str):
    """Удаление изображения"""
    try:
        # Извлекаем имя файла из URL
        filename = image_url.split("/")[-1]
        file_path = UPLOAD_DIR / filename

        if file_path.exists():
            os.remove(file_path)
            return {"message": "Изображение удалено"}
        else:
            raise HTTPException(status_code=404, detail="Изображение не найдено")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
