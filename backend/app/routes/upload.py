from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List
import os
import uuid
from pathlib import Path
import cloudinary
import cloudinary.uploader
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Конфигурация Cloudinary из переменных окружения
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
    secure=True
)

# Проверяем настроена ли Cloudinary
USE_CLOUDINARY = bool(
    os.getenv("CLOUDINARY_CLOUD_NAME") and
    os.getenv("CLOUDINARY_API_KEY") and
    os.getenv("CLOUDINARY_API_SECRET")
)

# Папка для локальной загрузки (fallback если Cloudinary не настроена)
UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Разрешенные расширения
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/images", response_model=List[str])
async def upload_images(
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user)
):
    """Загрузка изображений в Cloudinary или локально"""
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

        try:
            if USE_CLOUDINARY:
                # Загрузка в Cloudinary
                unique_public_id = f"real_estate/{uuid.uuid4()}"
                result = cloudinary.uploader.upload(
                    content,
                    public_id=unique_public_id,
                    folder="real_estate_app",
                    resource_type="image",
                    overwrite=False,
                    transformation=[
                        {'width': 1200, 'height': 900, 'crop': 'limit'},
                        {'quality': 'auto:good'},
                        {'fetch_format': 'auto'}
                    ]
                )
                uploaded_urls.append(result['secure_url'])
            else:
                # Локальное сохранение (fallback)
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                file_path = UPLOAD_DIR / unique_filename

                with open(file_path, "wb") as f:
                    f.write(content)

                uploaded_urls.append(f"/static/uploads/{unique_filename}")

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка загрузки файла: {str(e)}"
            )

    return uploaded_urls


@router.delete("/images")
async def delete_image(
    image_url: str,
    current_user = Depends(get_current_user)
):
    """Удаление изображения из Cloudinary или локально"""
    try:
        if USE_CLOUDINARY and "cloudinary.com" in image_url:
            # Извлекаем public_id из Cloudinary URL
            # URL формат: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            parts = image_url.split("/")
            if "upload" in parts:
                upload_index = parts.index("upload")
                public_id_with_ext = "/".join(parts[upload_index + 2:])  # Пропускаем версию
                public_id = os.path.splitext(public_id_with_ext)[0]

                # Удаляем из Cloudinary
                result = cloudinary.uploader.destroy(public_id)

                if result.get('result') == 'ok':
                    return {"message": "Изображение удалено из облака"}
                else:
                    raise HTTPException(status_code=404, detail="Изображение не найдено в облаке")
        else:
            # Локальное удаление
            filename = image_url.split("/")[-1]
            file_path = UPLOAD_DIR / filename

            if file_path.exists():
                os.remove(file_path)
                return {"message": "Изображение удалено"}
            else:
                raise HTTPException(status_code=404, detail="Изображение не найдено")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка удаления: {str(e)}")


@router.get("/config")
async def get_upload_config():
    """Получить информацию о конфигурации загрузки"""
    return {
        "storage_type": "cloudinary" if USE_CLOUDINARY else "local",
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
        "allowed_extensions": list(ALLOWED_EXTENSIONS)
    }
