from sqlalchemy.orm import Session

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, MyTodoCreate, TodoUpdate

from app.crud.base import CRUDBase


class CRUDTodo(CRUDBase[Todo, TodoCreate, TodoUpdate]):
    def create_by_user(
        self, db: Session, todo_create: TodoCreate, user_id: int
    ) -> Todo:
        db_obj = self.model(**todo_create.model_dump(), created_by=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_mine_by_user(
        self, db: Session, my_todo_create: MyTodoCreate, user_id: int
    ) -> Todo:
        todo_create = TodoCreate(**my_todo_create.model_dump(), owner_id=user_id)
        return self.create_by_user(db=db, todo_create=todo_create, user_id=user_id)

    def update_by_user(
        self, db: Session, todo_update: TodoUpdate, db_obj: Todo, user_id: int
    ) -> Todo:
        todo_update_dict = todo_update.model_dump(exclude_unset=True)
        todo_update_dict["updated_by"] = user_id
        db_obj = super().update(db=db, db_obj=db_obj, obj_in=todo_update_dict)
        return db_obj

    def is_owner(self, db_obj: Todo, user_id: int) -> bool:
        return db_obj.owner_id == user_id


todo = CRUDTodo(Todo)
