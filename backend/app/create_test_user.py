from app.db.session import SessionLocal
from app.schemas.user import UserCreate
from app import crud


initial_data = [
    UserCreate(username="test", password="test", is_superuser=True),
    UserCreate(username="1", password="1"),
    UserCreate(username="2", password="2"),
]


def init() -> None:
    db = SessionLocal()
    for data in initial_data:
        crud.user.create(db, data)


if __name__ == "__main__":
    init()
