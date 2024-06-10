from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin


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
    owner_id = Column(
        Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
    )
    name = Column(String(200), nullable=True)

    tasks = relationship(
        "Task",
        back_populates="todo",
    )

    owner = relationship(
        "User",
        back_populates="todos",
        passive_deletes=True,
        uselist=False,
    )
