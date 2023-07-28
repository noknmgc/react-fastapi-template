from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_current_admin_user
from app import crud, schemas, models

router = APIRouter()


@router.post("", response_model=schemas.UserResponse)
def create_user(
    user_create: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    user = crud.user.read_by_signin_id(db, user_create.signin_id)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The id already exists in the system.",
        )
    user = crud.user.create(db, user_create)
    return user


@router.get("/{signin_id}", response_model=schemas.UserResponse)
def read_user(
    signin_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = crud.user.read_by_signin_id(db, signin_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=List[schemas.UserResponse])
def read_all_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
):
    users = crud.user.read_multi(db, skip=skip, limit=limit)
    return users


@router.put("/myself", response_model=schemas.UserResponse)
def update_myself(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = crud.user.update(db, user_update, current_user)
    return user


@router.put("/{signin_id}", response_model=schemas.UserResponse)
def update_user(
    signin_id: str,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    db_obj = crud.user.read_by_signin_id(db, signin_id)
    if db_obj is None:
        raise HTTPException(status_code=404, detail="User not found")
    user = crud.user.update(db, user_update, db_obj)
    return user


@router.delete("/{signin_id}", response_model=None)
def delete_user(
    signin_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    user = crud.user.read_by_signin_id(db, signin_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    crud.user.delete(db, user.id)
