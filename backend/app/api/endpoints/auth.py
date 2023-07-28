from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core import security
from app import schemas, crud, models

router = APIRouter()


@router.post("/login/token", response_model=schemas.Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = crud.user.authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif user.active:
        raise HTTPException(status_code=409, detail="The user is already used")
    crud.user.login(db, user)
    payload = schemas.TokenPayload(user_id=user.id)
    access_token = security.create_access_token(
        payload, expires_delta=timedelta(settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", response_model=None)
def logout(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    crud.user.logout(db, current_user)
