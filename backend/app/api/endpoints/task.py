from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.api.deps import get_db, get_current_user, get_my_todo

router = APIRouter(prefix="/{todo_id}/tasks")


@router.post("", response_model=schemas.TaskResponse)
def create_task(
    task_create: schemas.TaskCreate,
    todo: models.Todo = Depends(get_my_todo),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    新規Taskの作成
    """
    task = crud.task.create_with_todo_by_user(
        db=db,
        task_create=task_create,
        todo_id=todo.id,
        user_id=current_user.id,
    )
    return task


@router.get("", response_model=list[schemas.TaskResponse])
def read_todo_tasks(
    todo: models.Todo = Depends(get_my_todo),
    current_user: models.User = Depends(get_current_user),
):
    """
    todoの全てのTaskを取得
    """
    return todo.tasks


@router.get("/{task_id}", response_model=schemas.TaskResponse)
def read_todo_task(
    task_id: int,
    todo: models.Todo = Depends(get_my_todo),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    指定したIDのタスクを取得
    """
    task = crud.task.read(db=db, id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task{task_id}が存在しません。",
        )
    if not crud.task.includes_todo(db_obj=task, todo_id=todo.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="task idかtodo idが不正です。",
        )

    return task


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_todo_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    todo: models.Todo = Depends(get_my_todo),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    指定したIDのタスクの更新
    """
    db_obj = crud.task.read(db=db, id=task_id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task{task_id}は存在しません。",
        )
    if not crud.task.includes_todo(db_obj=db_obj, todo_id=todo.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="task idかtodo idが不正です。",
        )

    task = crud.task.update_by_user(
        db=db, task_update=task_update, db_obj=db_obj, user_id=current_user.id
    )
    return task


@router.delete("/{task_id}", response_model=None)
def delete_todo_task(
    task_id: int,
    todo: models.Todo = Depends(get_my_todo),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    指定したIDのタスクを削除
    """
    db_obj = crud.task.read(db=db, id=task_id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task{task_id}は存在しません。",
        )
    if not crud.task.includes_todo(db_obj=db_obj, todo_id=todo.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="task idかtodo idが不正です。",
        )

    crud.task.delete(db=db, id=task_id)
    return
