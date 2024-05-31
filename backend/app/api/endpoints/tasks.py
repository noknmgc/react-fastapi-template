from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_current_admin_user
from app import crud, schemas, models


router = APIRouter()


@router.post("", response_model=schemas.TaskResponse)
def create_task(
    task_create: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = crud.task.create(db, task_create, current_user.id)
    return task


@router.get("/{id}", response_model=schemas.TaskResponse)
def read_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = crud.task.read(db, id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Permission denied")
    return task


@router.get("", response_model=List[schemas.TaskResponse])
def read_own_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks = crud.task.read_multi_by_owner(db, current_user.id, skip, limit)
    return tasks


@router.get("/all/", response_model=List[schemas.TaskResponse])
def read_all_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    tasks = crud.task.read_multi(db, skip, limit)
    return tasks


@router.put("/{id}", response_model=schemas.TaskResponse)
def update_task(
    id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = crud.task.read(db, id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Permission denied")
    updated_task = crud.task.update(db, task, task_update)
    return updated_task


@router.delete("/{id}", response_model=None)
def delete_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = crud.task.read(db, id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Permission denied")
    crud.task.delete(db, id)
