from pydantic import BaseModel, PostgresDsn
import secrets


class Settings(BaseModel):
    SQLALCHEMY_DATABASE_URI: PostgresDsn = "postgresql://postgres:postgres@db:5432/test"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()
