"""
Скрипт для инициализации базы данных и создания администратора
"""
from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.real_estate import RealEstateObject
from app.core.security import get_password_hash


def init_db():
    # Создание таблиц
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Проверка существования админа
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        # Создание администратора
        admin = User(
            email="admin@example.com",
            username="admin",
            full_name="Administrator",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        print("✓ Создан пользователь admin с паролем: admin123")

    # Создание тестового пользователя
    test_user = db.query(User).filter(User.username == "user").first()
    if not test_user:
        test_user = User(
            email="user@example.com",
            username="user",
            full_name="Test User",
            hashed_password=get_password_hash("user123"),
            is_active=True,
            is_admin=False
        )
        db.add(test_user)
        print("✓ Создан тестовый пользователь user с паролем: user123")

    db.commit()

    # Добавление примеров объектов недвижимости
    objects_count = db.query(RealEstateObject).count()
    if objects_count == 0:
        sample_objects = [
            RealEstateObject(
                title="Современная квартира в центре",
                description="Просторная 2-комнатная квартира с отличным ремонтом",
                property_type="Квартира",
                address="ул. Ленина, 15",
                city="Москва",
                price=8500000,
                area=65,
                rooms=2,
                floor=5,
                total_floors=10,
                year_built=2020,
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Уютный дом с участком",
                description="Кирпичный дом с большим участком и гаражом",
                property_type="Дом",
                address="ул. Садовая, 42",
                city="Санкт-Петербург",
                price=15000000,
                area=150,
                rooms=4,
                year_built=2018,
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Коммерческое помещение",
                description="Помещение под магазин или офис в проходимом месте",
                property_type="Коммерческая",
                address="пр. Мира, 88",
                city="Москва",
                price=25000000,
                area=200,
                floor=1,
                total_floors=5,
                year_built=2015,
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Студия в новостройке",
                description="Компактная студия с современной планировкой",
                property_type="Квартира",
                address="ул. Новая, 7",
                city="Казань",
                price=3200000,
                area=28,
                rooms=1,
                floor=12,
                total_floors=25,
                year_built=2023,
                owner_id=test_user.id
            ),
            RealEstateObject(
                title="Трёхкомнатная квартира",
                description="Просторная квартира в тихом районе",
                property_type="Квартира",
                address="ул. Парковая, 23",
                city="Новосибирск",
                price=6800000,
                area=85,
                rooms=3,
                floor=3,
                total_floors=9,
                year_built=2010,
                owner_id=test_user.id
            )
        ]

        for obj in sample_objects:
            db.add(obj)

        print(f"✓ Создано {len(sample_objects)} тестовых объектов недвижимости")

    db.commit()
    db.close()

    print("\n✓ База данных успешно инициализирована!")
    print("\nДанные для входа:")
    print("Администратор - username: admin, password: admin123")
    print("Пользователь - username: user, password: user123")


if __name__ == "__main__":
    init_db()
