from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base, TimestampMixin


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
    """

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)

    todos = relationship(
        "Todo",
        back_populates="user",
        passive_deletes=True,
    )
