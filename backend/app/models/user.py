from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.db.base import Base

if TYPE_CHECKING:
    from .task import Task


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    signin_id = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, index=True)
    role = Column(String, default="User")
    tasks = relationship("Task", back_populates="owner")
