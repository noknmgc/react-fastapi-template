from fastapi import APIRouter

from app.api.endpoints import root, auth, users, tasks

api_router = APIRouter()
api_router.include_router(root.router, tags=["test"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
