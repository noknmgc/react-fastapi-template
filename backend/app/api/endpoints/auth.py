from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core import security
from app import schemas, crud, models

router = APIRouter()


@router.post("/login/token", response_model=schemas.Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    ユーザー認証を行い、認証されればJWTを返す。
    """
    user = crud.user.authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ユーザー名かパスワードが異なります。",
        )
    payload = schemas.TokenPayload(sub=str(user.id))
    access_token = security.create_access_token(payload)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=None)
def login_cookie(
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """
    ユーザー認証を行い、認証されれば、Set-Cookie : JWTとする。
    """
    user = crud.user.authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400, detail="ユーザー名かパスワードが異なります。"
        )
    payload = schemas.TokenPayload(sub=str(user.id))
    access_token, expire = security.create_access_token(payload, return_expire=True)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        expires=expire,
    )
    return None


@router.post("/logout", response_model=None)
def logout(response: Response, current_user: models.User = Depends(get_current_user)):
    response.delete_cookie("access_token")
    return None
