"""
Скрипт для инициализации базы данных и создания администратора с тестовыми данными
"""
import json
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
            # ЖИЛАЯ НЕДВИЖИМОСТЬ - Квартиры
            RealEstateObject(
                title="Современная 2-комнатная квартира в ЖК 'Центральный'",
                description="Просторная квартира с качественным ремонтом в стиле минимализм. Полностью меблирована и готова к проживанию. В квартире установлены французские окна с видом на парк, система умный дом, кондиционеры во всех комнатах. Закрытая охраняемая территория, подземный паркинг, детская площадка. Рядом школа, детский сад, торговый центр.",
                main_category="Жилая",
                property_type="Квартира",
                address="ул. Ленина, 15, кв. 42",
                city="Москва",
                price=8500000,
                area=65.5,
                rooms=2,
                floor=5,
                total_floors=10,
                year_built=2020,
                images=json.dumps([]),
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Студия в элитном ЖК у метро",
                description="Компактная студия с современной планировкой и дизайнерским ремонтом. Панорамные окна, высокие потолки 3м, встроенная кухня с техникой Bosch. В доме консьерж-сервис, фитнес-зал, SPA. Отличная транспортная доступность - 3 минуты пешком до метро.",
                main_category="Жилая",
                property_type="Квартира",
                address="ул. Новая, 7, кв. 156",
                city="Санкт-Петербург",
                price=4200000,
                area=28,
                rooms=1,
                floor=12,
                total_floors=25,
                year_built=2023,
                images=json.dumps([]),
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Просторная 3-комнатная квартира в тихом районе",
                description="Отличная квартира для семьи с детьми. Три изолированные комнаты, большая кухня-гостиная, два санузла, балкон и лоджия. Школа и детский сад во дворе. Развитая инфраструктура: супермаркеты, поликлиника, парк в 5 минутах ходьбы.",
                main_category="Жилая",
                property_type="Квартира",
                address="ул. Парковая, 23, кв. 78",
                city="Казань",
                price=6800000,
                area=85,
                rooms=3,
                floor=3,
                total_floors=9,
                year_built=2010,
                images=json.dumps([]),
                owner_id=test_user.id
            ),

            # ЖИЛАЯ НЕДВИЖИМОСТЬ - Дома
            RealEstateObject(
                title="Уютный кирпичный дом с участком 10 соток",
                description="Добротный дом из красного кирпича в экологически чистом районе. Два этажа, мансарда, гараж на 2 машины. На участке плодовый сад, теплица, баня. Все коммуникации: газ, вода, канализация, электричество 15кВт. Асфальтированная дорога, до города 15 минут на машине.",
                main_category="Жилая",
                property_type="Дом",
                address="ул. Садовая, 42",
                city="Московская область",
                price=15000000,
                area=150,
                rooms=4,
                floor=2,
                total_floors=2,
                year_built=2018,
                images=json.dumps([]),
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Таунхаус в коттеджном поселке премиум-класса",
                description="Современный таунхаус с отделкой под ключ. Три уровня, терраса, камин, панорамные окна. Закрытая охраняемая территория, общий бассейн, детская площадка, зона барбекю. Собственное озеро, лес. Идеально для жизни за городом с комфортом.",
                main_category="Жилая",
                property_type="Дом",
                address="КП 'Лесной', уч. 15",
                city="Ленинградская область",
                price=22000000,
                area=180,
                rooms=5,
                floor=3,
                total_floors=3,
                year_built=2022,
                images=json.dumps([]),
                owner_id=test_user.id
            ),

            # КОММЕРЧЕСКАЯ НЕДВИЖИМОСТЬ - Офисы
            RealEstateObject(
                title="Офис класса А в бизнес-центре на Невском",
                description="Представительский офис в премиальном бизнес-центре. Высокие потолки, панорамные окна, свежий ремонт. Рецепция, охрана 24/7, подземный паркинг. Отличная локация в самом центре деловой активности города. Рядом метро, кафе, банки.",
                main_category="Коммерческая",
                property_type="Офис",
                address="Невский пр., 100, оф. 501",
                city="Санкт-Петербург",
                price=45000000,
                area=120,
                floor=5,
                total_floors=15,
                year_built=2019,
                images=json.dumps([]),
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Офисное помещение в IT-кластере",
                description="Современный опен-спейс офис в новом IT-квартале. Гибкая планировка, возможность зонирования. Вся инфраструктура: переговорные комнаты, зоны отдыха, столовая, парковка. Оптоволоконный интернет 1 Гбит/с. Идеально для IT-компаний и стартапов.",
                main_category="Коммерческая",
                property_type="Офис",
                address="Инновационный бульвар, 23",
                city="Москва",
                price=28000000,
                area=200,
                floor=7,
                total_floors=12,
                year_built=2021,
                images=json.dumps([]),
                owner_id=test_user.id
            ),

            # КОММЕРЧЕСКАЯ НЕДВИЖИМОСТЬ - Торговые помещения
            RealEstateObject(
                title="Торговое помещение на первой линии",
                description="Отдельно стоящее здание в проходимом месте. Большие витрины, отдельный вход, парковка на 20 мест. Подходит под магазин, шоурум, кафе, салон красоты. Все коммуникации, возможность перепланировки. Высокий трафик - более 5000 человек в день.",
                main_category="Коммерческая",
                property_type="Торговая площадь",
                address="пр. Мира, 88",
                city="Новосибирск",
                price=35000000,
                area=250,
                floor=1,
                total_floors=2,
                year_built=2015,
                images=json.dumps([]),
                owner_id=admin.id
            ),
            RealEstateObject(
                title="Помещение в торговом центре",
                description="Готовое помещение в крупном ТЦ с большим потоком покупателей. Отделка, освещение, системы безопасности. Рядом якорные арендаторы: гипермаркет, кинотеатр, фудкорт. Удобная транспортная развязка, бесплатная парковка на 500+ машин.",
                main_category="Коммерческая",
                property_type="Торговая площадь",
                address="ТЦ 'Мега', секция 2-15",
                city="Казань",
                price=18000000,
                area=85,
                floor=2,
                total_floors=3,
                year_built=2017,
                images=json.dumps([]),
                owner_id=test_user.id
            ),
        ]

        for obj in sample_objects:
            db.add(obj)

        print(f"✓ Создано {len(sample_objects)} тестовых объектов недвижимости:")
        print(f"  - Жилая недвижимость: 5 объектов (квартиры и дома)")
        print(f"  - Коммерческая недвижимость: 4 объекта (офисы и торговые площади)")

    db.commit()
    db.close()

    print("\n✓ База данных успешно инициализирована!")
    print("\nДанные для входа:")
    print("Администратор - username: admin, password: admin123")
    print("Пользователь - username: user, password: user123")


if __name__ == "__main__":
    init_db()
