from typing import Optional
from datetime import datetime, timedelta, UTC

import bcrypt
from jose import jwt
from fastapi import Request, HTTPException
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel

from app import schemas
from app.core.config import settings

ALGORITHM = "HS256"


def create_access_token(
    payload: schemas.TokenPayload,
    expires_delta: timedelta | None = None,
    return_expire=False,
):
    if expires_delta:
        exp = datetime.now(UTC) + expires_delta
    else:
        exp = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {key: value for key, value in payload}
    to_encode.update({"exp": exp})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

    if return_expire:
        return encoded_jwt, exp
    else:
        return encoded_jwt


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hashed_pwd_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password=pwd_bytes, hashed_password=hashed_pwd_bytes)


class OAuth2PasswordBearerWithCookie(OAuth2):
    """
    JWTをAuthorizationヘッダーまたは、Cookieのaccess_tokenから取得するクラス
    """

    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str = None,
        scopes: dict = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.headers.get("Authorization")
        if not authorization:
            authorization: str = request.cookies.get("access_token")

        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=401,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None

        return param
