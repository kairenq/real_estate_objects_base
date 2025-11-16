from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import List
import base64
import io
from PIL import Image
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

# Разрешенные форматы изображений
ALLOWED_FORMATS = {"JPEG", "PNG", "GIF", "WEBP"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGE_DIMENSION = 1200  # Максимальная ширина/высота


def optimize_image(image_bytes: bytes, max_dimension: int = MAX_IMAGE_DIMENSION) -> tuple[str, str]:
    """
    Оптимизирует изображение: изменяет размер и конвертирует в base64
    Возвращает (base64_string, mime_type)
    """
    # Открываем изображение
    img = Image.open(io.BytesIO(image_bytes))

    # Конвертируем в RGB если есть альфа-канал
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
        img = background

    # Изменяем размер если изображение слишком большое
    if img.width > max_dimension or img.height > max_dimension:
        img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

    # Сохраняем в буфер с оптимизацией
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=85, optimize=True)
    output.seek(0)

    # Конвертируем в base64
    base64_string = base64.b64encode(output.getvalue()).decode('utf-8')

    return base64_string, "image/jpeg"


@router.post("/images", response_model=List[str])
async def upload_images(
    files: List[UploadFile] = File(...),
    current_user = Depends(get_current_user)
):
    """
    Загрузка изображений и конвертация в base64 data URI
    Изображения хранятся в базе данных, не требуют внешних сервисов
    """
    if not files:
        raise HTTPException(status_code=400, detail="Файлы не предоставлены")

    uploaded_data_uris = []
    errors = []

    for file in files:
        try:
            # Проверка что это изображение
            if not file.content_type or not file.content_type.startswith('image/'):
                errors.append(f"Файл {file.filename} не является изображением (тип: {file.content_type})")
                continue

            # Читаем содержимое
            content = await file.read()

            if not content or len(content) == 0:
                errors.append(f"Файл {file.filename} пустой")
                continue

            # Проверка размера
            if len(content) > MAX_FILE_SIZE:
                errors.append(f"Файл {file.filename} слишком большой ({len(content)} байт). Максимум 5MB")
                continue

            # Оптимизируем и конвертируем в base64
            base64_string, mime_type = optimize_image(content)

            # Создаем data URI
            data_uri = f"data:{mime_type};base64,{base64_string}"

            uploaded_data_uris.append(data_uri)

        except Exception as e:
            errors.append(f"Ошибка обработки файла {file.filename}: {str(e)}")
            continue

    # Если ни один файл не загружен успешно
    if not uploaded_data_uris and errors:
        raise HTTPException(
            status_code=400,
            detail=f"Не удалось загрузить изображения. Ошибки: {'; '.join(errors)}"
        )

    return uploaded_data_uris


@router.delete("/images")
async def delete_image(
    image_url: str,
    current_user = Depends(get_current_user)
):
    """
    Удаление изображения (для base64 это просто подтверждение)
    Фактическое удаление происходит при обновлении объекта в БД
    """
    # Для base64 изображений нечего удалять с диска
    # Они хранятся в БД и удаляются при обновлении записи
    return {"message": "Изображение будет удалено при сохранении"}


@router.get("/config")
async def get_upload_config():
    """Получить информацию о конфигурации загрузки"""
    return {
        "storage_type": "database_base64",
        "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
        "max_image_dimension": MAX_IMAGE_DIMENSION,
        "optimization": "enabled"
    }
