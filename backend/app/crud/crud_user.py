from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.models.users import Users
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash


def read_user(db: Session, signin_id: str):
    return db.query(Users).filter(Users.signin_id == signin_id).first()


def read_all_users(db: Session):
    return db.query(Users).all()


def create_user(db: Session, user_create: UserCreate):
    db_obj = Users(
        signin_id=user_create.signin_id,
        hashed_password=get_password_hash(user_create.password),
        name=user_create.name,
        role=user_create.role,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_user(db: Session, user_update: UserUpdate, db_obj: Users):
    db_obj_dict = jsonable_encoder(db_obj)

    for field, value in user_update:
        if value is None:
            continue

        if field in db_obj_dict:
            if field == "passward":
                setattr(db_obj, "hashed_password", get_password_hash(value))
            else:
                setattr(db_obj, field, value)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_user(db: Session, db_obj: Users):
    db.delete(db_obj)
    db.commit()
