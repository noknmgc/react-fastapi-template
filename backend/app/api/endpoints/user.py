from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.api.deps import get_db, get_current_user, get_current_superuser

router = APIRouter()


@router.post("", response_model=schemas.UserResponse)
def create_user(
    user_create: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_superuser),
):
    """
    新規ユーザーの作成
    """
    user = crud.user.read_by_username(db, user_create.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="そのユーザー名は、すでに使用されています。",
        )
    user = crud.user.create(db, user_create)
    return user


@router.get("", response_model=list[schemas.UserResponse])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
):
    """
    ユーザーの情報取得
    """
    users = crud.user.read_multi(db=db, skip=skip, limit=limit)
    return users


@router.get("/{username}", response_model=schemas.UserResponse)
def read_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    指定したusernameのユーザー情報の取得
    """
    user = crud.user.read_by_username(db=db, username=username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ユーザー{username}は存在しません。",
        )
    return user


@router.put("/{username}", response_model=schemas.UserResponse)
def update_user(
    username: str,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_superuser),
):
    """
    指定したusernameのユーザー情報の更新
    """
    user = crud.user.read_by_username(db=db, username=username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user = crud.user.update(db, user_update, user)
    return user


@router.delete("/{username}", response_model=None)
def delete_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_superuser),
):
    """
    指定したusernameのユーザー削除
    """
    user = crud.user.read_by_username(db=db, username=username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"ユーザー{username}は存在しません。",
        )
    crud.user.delete(db=db, id=user.id)
    return None
