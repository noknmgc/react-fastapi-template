from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class UserCreate(BaseModel):
    username: str = Field(max_length=100)
    password: str = Field(max_length=100)
    is_superuser: Optional[bool] = False


class UserUpdate(BaseModel):
    password: str = None
    is_superuser: bool = None


class UserResponse(BaseModel):
    id: int
    username: str
    is_superuser: bool

    # sqlalchemyのモデルからキャストするための設定
    model_config = ConfigDict(from_attributes=True)
