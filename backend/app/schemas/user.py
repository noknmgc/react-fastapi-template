from typing import Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    signin_id: str
    name: str


class UserCreate(BaseModel):
    signin_id: str
    password: str
    name: Optional[str] = ""


class UserUpdate(BaseModel):
    signin_id: str
    password: str
    name: str | None = None


class UserResponse(BaseModel):
    signin_id: str
    name: str
    active: bool

    class Config:
        orm_mode = True
