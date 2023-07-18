from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserResponse
from app.api.deps import get_db
from app.crud.crud_user import get_user

router = APIRouter()


@router.get("/{signin_id}", response_model=UserResponse)
def get_user_data(signin_id: str, db: Session = Depends(get_db)):
    user = get_user(db, signin_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
