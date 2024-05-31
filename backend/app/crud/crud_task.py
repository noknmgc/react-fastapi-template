from typing import List

from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.crud.base import CRUDBase


class CRUDTask(CRUDBase[Task, TaskCreate, TaskUpdate]):
    def create(self, db: Session, task_create: TaskCreate, owner_id: int):
        # DBのtaskにはowner idを加えるので、createはオーバーライド
        db_obj = self.model(**task_create.dict(), owner_id=owner_id)  # type: ignore
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def read_multi_by_owner(
        self, db: Session, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Task]:
        return (
            db.query(self.model)
            .filter(Task.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


task = CRUDTask(Task)
