import secrets
from typing import List

from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn


class Settings(BaseSettings):
    API_STR: str = ""
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:5500",
    ]
    PROJECT_NAME: str = "react-fastapi-template"

    SQLALCHEMY_DATABASE_URI: PostgresDsn = "postgresql://postgres:postgres@db:5432/test"


settings = Settings()
