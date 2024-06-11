from typing import Generator

from fastapi import Depends, HTTPException, status, Path
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app import models, schemas, crud
from app.core.config import settings
from app.core.security import ALGORITHM, OAuth2PasswordBearerWithCookie

oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="login/token")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="資格情報が無効です。",
        )
    user = crud.user.read(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="資格情報のユーザーは見つかりませんでした。",
        )
    return user


def get_current_superuser(current_user: models.User = Depends(get_current_user)):
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="権限が不十分です。",
        )
    return current_user


def get_my_todo(
    todo_id: int = Path(),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.Todo:
    """
    自分のTODOを取得する関数。
    """
    db_obj = crud.todo.read(db=db, id=todo_id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo{todo_id}が存在しません。",
        )

    if not crud.todo.is_owner(db_obj=db_obj, user_id=current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Todoを編集する権限がありません。",
        )
    return db_obj
