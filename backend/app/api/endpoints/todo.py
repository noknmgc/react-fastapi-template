from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.api.deps import get_db, get_current_user

router = APIRouter()


@router.post("", response_model=schemas.TodoResponse)
def create_my_todo(
    my_todo_create: schemas.MyTodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    新規TODOの作成
    """
    todo = crud.todo.create_mine_by_user(
        db=db, my_todo_create=my_todo_create, user_id=current_user.id
    )
    return todo


@router.get("", response_model=list[schemas.TodoResponse])
def read_my_todos(
    current_user: models.User = Depends(get_current_user),
):
    """
    自分の全てのTODOの取得
    """
    return current_user.todos


@router.put("/{todo_id}", response_model=schemas.TodoResponse)
def update_my_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    自分のTODOの更新
    """
    db_obj = crud.todo.read(db=db, id=todo_id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo{todo_id}が存在しません。",
        )

    if not crud.todo.is_owner(db_obj=db_obj, user_id=current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Todoを編集する権限がありません。",
        )

    todo = crud.todo.update_by_user(
        db=db, todo_update=todo_update, db_obj=db_obj, user_id=current_user.id
    )
    return todo


@router.delete("/{todo_id}", response_model=None)
def delete_my_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    自分のTODOの削除
    """
    db_obj = crud.todo.read(db=db, id=todo_id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo{todo_id}が存在しません。",
        )

    if not crud.todo.is_owner(db_obj=db_obj, user_id=current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Todoを編集する権限がありません。",
        )

    crud.todo.delete(db=db, id=todo_id)
    return None
