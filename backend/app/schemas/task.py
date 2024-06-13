from pydantic import BaseModel, Field, ConfigDict


class TaskCreate(BaseModel):
    name: str = Field("", max_length=500)
    done: bool = Field(False)


class TaskUpdate(BaseModel):
    name: str | None = None
    done: bool | None = None


class TaskResponse(BaseModel):
    id: int
    name: str = ""
    done: bool

    model_config = ConfigDict(from_attributes=True)
