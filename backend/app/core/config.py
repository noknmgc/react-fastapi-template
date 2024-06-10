from pydantic import BaseModel, PostgresDsn


class Settings(BaseModel):
    SQLALCHEMY_DATABASE_URI: PostgresDsn = "postgresql://postgres:postgres@db:5432/test"


settings = Settings()
