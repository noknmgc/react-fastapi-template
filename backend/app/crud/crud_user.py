from sqlalchemy.orm import Session

from app.models.users import Users
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash


def get_user(db: Session, signin_id: str):
    return db.query(Users).filter(Users.signin_id == signin_id).first()


def create_user(db: Session, user_create: UserCreate):
    db_obj = Users(
        signin_id=user_create.signin_id,
        hashed_password=get_password_hash(user_create.password),
        name=user_create.name,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)


def update_user(db: Session, user_update: UserUpdate, db_obj: Users):
    pass


def is_active_user(user: Users):
    return user.active
