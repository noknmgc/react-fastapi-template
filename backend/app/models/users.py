from sqlalchemy import Column, Integer, String, Boolean

from app.db.base import Base


class Users(Base):
    id = Column(Integer, primary_key=True, index=True)
    signin_id = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, index=True)
    active = Column(Boolean(), default=False)
