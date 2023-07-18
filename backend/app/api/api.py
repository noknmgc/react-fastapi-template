from fastapi import APIRouter

from app.api.endpoints import root, users

api_router = APIRouter()
api_router.include_router(root.router, tags=["test"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
