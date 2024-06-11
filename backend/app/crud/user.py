from typing import Any, Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

from app.crud.base import CRUDBase
from app.core.security import get_password_hash


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def read_by_username(self, db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def create(self, db: Session, user_create: UserCreate) -> User:
        # userはpasswordをhashed passwordにするので、CRUDBaseのcreateはオーバーライド
        user_create_dict = self.__hash_password(user_create)
        db_obj = self.model(**user_create_dict)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, user_update: UserUpdate, db_obj: User) -> User:
        # userはpasswordをhashed passwordにするので、CRUDBaseのupdateはオーバーライド
        user_update_dict = self.__hash_password(user_update)

        db_obj = super().update(db, db_obj, user_update_dict)
        return db_obj

    def __hash_password(self, user_schema: UserCreate | UserUpdate) -> dict[str, Any]:
        user_dict: dict[str, Any] = {}
        for field, value in user_schema:
            if value is None:
                continue
            if field == "password":
                user_dict["hashed_password"] = get_password_hash(value)
            else:
                user_dict[field] = value
        return user_dict


user = CRUDUser(User)
