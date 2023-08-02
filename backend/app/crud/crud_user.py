from typing import Dict, Any, Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

from app.crud.base import CRUDBase


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def read_by_signin_id(self, db: Session, signin_id: str) -> Optional[User]:
        return db.query(User).filter(User.signin_id == signin_id).first()

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

    def authenticate(
        self, db: Session, signin_id: str, password: str
    ) -> Optional[User]:
        user = self.read_by_signin_id(db, signin_id=signin_id)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def login(self, db: Session, db_obj: User):
        super().update(db, db_obj, {"active": True})

    def logout(self, db: Session, db_obj: User):
        super().update(db, db_obj, {"active": False})

    def is_admin(self, user: User) -> bool:
        return user.role == "Admin"

    def __hash_password(self, user_schema: UserCreate | UserUpdate) -> Dict[str, Any]:
        user_dict: Dict[str, Any] = {}
        for field, value in user_schema:
            if value is None:
                continue
            if field == "password":
                user_dict["hashed_password"] = get_password_hash(value)
            else:
                user_dict[field] = value
        return user_dict


user = CRUDUser(User)
