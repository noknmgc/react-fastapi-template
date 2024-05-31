import logging

from app.db.session import SessionLocal
from app.schemas.user import UserCreate
from app import crud

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


initial_data = [
    UserCreate(signin_id="tarou", password="tarou", name="太郎"),
    UserCreate(signin_id="john", password="john"),
    UserCreate(signin_id="admin", password="password", role="Admin"),
]


def init() -> None:
    db = SessionLocal()
    for data in initial_data:
        crud.user.create(db, data)


if __name__ == "__main__":
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")
