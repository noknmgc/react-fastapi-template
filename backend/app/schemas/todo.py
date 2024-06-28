from pydantic import BaseModel, Field, ConfigDict

from .task import TaskResponse


class TodoCreate(BaseModel):
    name: str = Field("", max_length=200)
    owner_id: int


class MyTodoCreate(BaseModel):
    name: str = Field("", max_length=200)


class TodoUpdate(BaseModel):
    name: str | None = Field(None, max_length=200)


class TodoResponse(BaseModel):
    id: int
    owner_id: int
    name: str

    tasks: list[TaskResponse]

    model_config = ConfigDict(from_attributes=True)
