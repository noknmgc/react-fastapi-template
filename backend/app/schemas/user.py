from typing import Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    signin_id: str
    name: str


class UserCreate(BaseModel):
    signin_id: str
    password: str
    name: Optional[str] = ""
    role: Optional[str] = "User"


class UserUpdate(BaseModel):
    signin_id: Optional[str]
    password: Optional[str]
    name: Optional[str]


class UserResponse(BaseModel):
    signin_id: str
    name: str
    role: str

    class Config:
        orm_mode = True
