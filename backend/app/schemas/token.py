from pydantic import BaseModel


class TokenPayload(BaseModel):
    sub: str


class Token(BaseModel):
    access_token: str
    token_type: str
