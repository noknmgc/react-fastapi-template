from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin


class Task(Base, TimestampMixin):
    """
    Taskのテーブル定義

    Attributes
    ----------
    id : int
        主キー
    todo_id : int
        taskが所属しているTodoのID
    name : str
        taskの名前
    done : boolean
        taskを実行したか否か
    """

    id = Column(Integer, primary_key=True, index=True)
    todo_id = Column(Integer, ForeignKey("todo.id", ondelete="CASCADE"))
    name = Column(String(500), nullable=True)
    done = Column(Boolean, default=False)

    todo = relationship(
        "Todo",
        back_populates="tasks",
        passive_deletes=True,
    )
