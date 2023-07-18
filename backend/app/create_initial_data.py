import logging

from app.db.session import SessionLocal
from app.schemas.user import UserCreate
from app.crud.crud_user import create_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


initial_data = [
    UserCreate(signin_id="tarou", password="tarou", name="太郎"),
    UserCreate(signin_id="john", password="john"),
    UserCreate(signin_id="test", password="test"),
]


def init() -> None:
    db = SessionLocal()
    for data in initial_data:
        create_user(db, data)


if __name__ == "__main__":
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")
