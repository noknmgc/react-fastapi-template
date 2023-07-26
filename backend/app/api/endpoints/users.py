from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserResponse, UserCreate, UserUpdate
from app.api.deps import get_db
from app.crud.crud_user import (
    read_user,
    read_all_users,
    create_user,
    update_user,
    delete_user,
)

router = APIRouter()


@router.post("/", response_model=UserResponse)
def create_user_in_db(user_create: UserCreate, db: Session = Depends(get_db)):
    user = read_user(db, user_create.signin_id)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The id already exists in the system.",
        )
    user = create_user(db, user_create)
    return user


@router.get("/{signin_id}", response_model=UserResponse)
def read_user_in_db(signin_id: str, db: Session = Depends(get_db)):
    user = read_user(db, signin_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[UserResponse])
def read_all_users_in_db(db: Session = Depends(get_db)):
    return read_all_users(db)


@router.put("/{signin_id}", response_model=UserResponse)
def update_user_in_db(
    signin_id: str, user_update: UserUpdate, db: Session = Depends(get_db)
):
    user_in_db = read_user(db, signin_id)
    if user_in_db is None:
        raise HTTPException(status_code=404, detail="User not found")
    user = update_user(db, user_update, user_in_db)
    return user


@router.delete("/{signin_id}", response_model=None)
def delete_user_in_db(signin_id: str, db: Session = Depends(get_db)):
    user = read_user(db, signin_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    delete_user(db, user)
