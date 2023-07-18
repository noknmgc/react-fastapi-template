from sqlalchemy import create_engine

from app.db.base import Base
from app.core.config import settings
import app.models


def reset_database(engine):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
    reset_database(engine=engine)
