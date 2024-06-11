from fastapi import APIRouter

from app.api.endpoints import root, auth, user

api_router = APIRouter()
api_router.include_router(root.router, tags=["test"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(user.router, tags=["users"], prefix="/users")
