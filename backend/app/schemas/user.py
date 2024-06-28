from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator


class UserCreate(BaseModel):
    username: str = Field(max_length=100)
    password: str = Field(max_length=100)
    is_superuser: Optional[bool] = False


class UserUpdate(BaseModel):
    password: Optional[str]
    is_superuser: Optional[bool]

    @field_validator("password", "is_superuser")
    @classmethod
    def check_must_not_null(cls, value):
        if value is None:
            raise ValueError("null is not allowed value.")
        return value


class UserResponse(BaseModel):
    id: int
    username: str
    is_superuser: bool

    # sqlalchemyのモデルからキャストするための設定
    model_config = ConfigDict(from_attributes=True)
