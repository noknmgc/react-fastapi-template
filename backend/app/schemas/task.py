from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str


class TaskUpdate(BaseModel):
    title: Optional[str]
    done: Optional[bool]


class TaskResponse(BaseModel):
    id: int
    title: str
    done: bool
    owner_id: int

    class Config:
        orm_mode = True
