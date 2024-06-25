from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin

if TYPE_CHECKING:
    from .task import Task
    from .user import User


class Todo(Base, TimestampMixin):
    """
    Todoのテーブル定義

    Attributes
    ----------
    id : int
        主キー
    name : str
        Todoリストの名前
    owner_id : int
        Todoリストの所有者
    """

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    name = Column(String(200), nullable=False, server_default="")

    tasks = relationship(
        "Task",
        back_populates="todo",
    )

    owner = relationship(
        "User",
        back_populates="todos",
        foreign_keys=[owner_id],
        passive_deletes=True,
        uselist=False,
    )
