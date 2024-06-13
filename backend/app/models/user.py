from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin

if TYPE_CHECKING:
    from .todo import Todo


class User(Base, TimestampMixin):
    """
    アプリケーションのユーザーテーブル

    Attributes
    ----------
    id : int
        DBのユニークなID
    username : str
        ユーザー名
    hashed_password : str
        ハッシュ化したパスワード
    is_superuser : bool
        スーパーユーザーならtrue
    """

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_superuser = Column(Boolean, default=False)

    todos = relationship(
        "Todo",
        back_populates="owner",
        foreign_keys="Todo.owner_id",
    )
