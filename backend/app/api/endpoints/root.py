from fastapi import APIRouter
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.get("/")
def redirect_docs():
    """
    docsへリダイレクト
    """
    return RedirectResponse("/docs")
