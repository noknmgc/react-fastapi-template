from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

from app.crud.base import CRUDBase


class CRUDTask(CRUDBase[Task, TaskCreate, TaskUpdate]):
    def create_with_todo_by_user(
        self, db: Session, task_create: TaskCreate, todo_id: int, user_id: int
    ) -> Task:
        db_obj = self.model(
            **task_create.model_dump(), todo_id=todo_id, created_by=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_by_user(
        self, db: Session, task_update: TaskUpdate, db_obj: Task, user_id: int
    ) -> Task:
        task_update_dict = task_update.model_dump(exclude_unset=True)
        task_update_dict["updated_by"] = user_id
        db_obj = super().update(db=db, db_obj=db_obj, obj_in=task_update_dict)
        return db_obj

    def includes_todo(self, db_obj: Task, todo_id: int) -> bool:
        return db_obj.todo_id == todo_id


task = CRUDTask(Task)
