# FastAPIのディレクトリ構成
ここでは、FastAPI + SQLAlchemyを利用した場合のディレクトリ構成について説明します。

## ディレクトリ構成の完成系と概要
完成系は、以下のようになります。
```sh
app
├── api
│   ├── endpoints       # routerとパスオペレーション関数
│   ├── deps.py         # Depends()に含める関数
│   └── api.py          # endpointsのrouterをひとつにまとめる
├── core
│   ├── config.py       # 設定値
│   └── security.py     # パスワードのハッシュ化やJWTの発行
├── crud                # DBのCRUD操作
├── db
│   ├── base.py         # マイグレーション用にBaseとmodelsを全て読み込む
│   ├── base_class.py   # SQLAlchemyのBaseクラスを定義
│   └── session.py      # DBのsessionmakerを記述
├── schemas             # pydanticを使ってリクエストボディやレスポンスボディの型を定義
├── models              # SQLAlchemyのモデルを定義
└── main.py             # api/api.pyをrouterをapp=FastAPI()に加える
```

以下から記述例など詳しく見ていきます。

### api
パスオペレーション関数やパスオペレーション関数の`Depends`に含める関数を記述していきます。

#### api/endpoints
FastAPIのパスオペレーション関数を配置していきます。

```
endpoints
├── __init__.py
├── users.py
└── items.py
```

`endpoints/users.py`記述例
```python
from fastapi import APIRouter, Depends

from app import schemas, models
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.post("", response_model=schemas.UserResponse)
def create_user(
    user_create: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pass
```

#### api/deps.py
パスオペレーション関数の`Depends`に含める関数を記述します。DBのセッション取得やJWTの取得は、ここで記述します。

記述例
```python
def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud.user.read(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
```

開発中に`deps.py`が肥大化していく場合があります。その際は、`deps`ディレクトリを作成し、その下にカテゴリごとのファイルを作成していきましょう。

```sh
api
└── deps
    ├── __init__.py
    ├── db.py           # DBのセッション取得
    └── security.py     # JWTの取得、ユーザー情報の取得
```

#### api/api.py
`api/endpoints`で定義されている`router`をひとつの`router`にまとめます。必要に応じて`tags`や`prefix`を付与していきます。

記述例
```python
from fastapi import APIRouter

from app.api.endpoints import users, items

api_router = APIRouter()
api_router.include_router(users.router, tags=["users"], prefix="/users") # tagsやprefixは設計に応じて付与
api_router.include_router(items.router, tags=["items"], prefix="/items")
```


### core
ここには、設定値やパスワードのハッシュ化を行う関数などを記述していきます。

#### core/config.py
設定値を記述します。pydanticを使って定義します。

記述例
```python
from pydantic import BaseModel, PostgresDsn

class Settings(BaseModel):
    SQLALCHEMY_DATABASE_URI: PostgresDsn = "postgresql://postgres:postgres@db:5432/test" # PostgreSQLを利用した場合の例
    SECRET_KEY: str = "..." # 省略
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()
```

#### core/security.py
パスワードのハッシュ化やJWTの発行は、ここに記述していきます。

```python
def create_access_token(
    payload: schemas.TokenPayload,
    expires_delta: timedelta | None = None,
):
    if expires_delta:
        exp = datetime.now(UTC) + expires_delta
    else:
        exp = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {key: value for key, value in payload}
    to_encode.update({"exp": exp})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def get_password_hash(password: str) -> str:
    pass

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pass
```

### crud
SQLAlchemyを使ってDBの操作を行うクラス・関数を定義します。操作の対象によってファイルを分けて定義します。

```sh
crud
├── __init__.py
├── user.py         # Userテーブルに対するCRUD
└── item.py         # Itemテーブルに対するCRUD
```

CRUD操作の定義の仕方は様々です。特にここでは定めませんが、[full-stack-fastapi-template](https://github.com/tiangolo/full-stack-fastapi-template)の[バージョン0.5.0](https://github.com/tiangolo/full-stack-fastapi-template/tree/0.5.0)では、クラスで定義されています。

::: details CRUD操作の実装例

まず、CRUD操作のベースとなるクラスを以下のように定義します。

`crud/base.py`
```python
from typing import List, Optional, Generic, TypeVar, Type

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db_session: Session, id: int) -> Optional[ModelType]:
        return db_session.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db_session: Session, *, skip=0, limit=100) -> List[ModelType]:
        return db_session.query(self.model).offset(skip).limit(limit).all()

    def create(self, db_session: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def update(
        self, db_session: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db_session.add(db_obj)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def remove(self, db_session: Session, *, id: int) -> ModelType:
        obj = db_session.query(self.model).get(id)
        db_session.delete(obj)
        db_session.commit()
        return obj
```

そして、それぞれのテーブルのCRUDについては、この`CRUDBase`クラスを継承し、必要に応じて変更を加えます。

`curd/user.py`
```python
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.crud.base import CRUDBase


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    # 必要に応じて、以下のようにメソッドを加えたり、オーバーライドする。
    def get_by_email(self, db_session: Session, *, email: str) -> Optional[User]:
        return db_session.query(User).filter(User.email == email).first()
```

また、同じファイルにこのクラスのインスタンスを生成し、パスオペレーション関数では、このインスタンスを利用して、CRUD操作を行なっていきます。

`crud/user.py`
```python
class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    pass

user = CRUDUser(User) # パスオペレーション関数では、このインスタンスを参照する
```

:::

### db
SQLAlchemyのBaseクラスやsessionmakerを定義していきます。

#### db/base_class.py
SQLAlchemyのBaseクラスの定義を行います。ここでは、テーブル名を自動で付与させいますが、それぞれのテーブルで定義しても良いです。

記述例
```python
from typing import Any

from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
```

#### db/session.py
SQLAlchemyでDBのセッションを取得するsessionmakerを定義します。

記述例
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### schemas
pydanticのBaseModelを利用し、リクエストボディやレスポンスボディの型(スキーマ)を定義していきます。CRUD操作で作成する必要のあるものは、作成(Create)のリクエストボディ、更新(Update)のリクエストボディ、レスポンスボディの3つです。

ここでは、テーブルごとにファイル分けします。

```sh
schemas
├── __init__.py
├── user.py         # Userに対するスキーマ
└── item.py         # Itemに対するスキーマ
```

`schemas/user.py`の記述例
```python
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class UserCreate(BaseModel):
    username: str = Field(max_length=100)
    password: str = Field(max_length=100)
    is_superuser: Optional[bool] = False


class UserUpdate(BaseModel):
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    is_superuser: bool

    # sqlalchemyのモデルからキャストするための設定
    model_config = ConfigDict(from_attributes=True)
```


### models
SQLAlchemyのモデル(テーブル定義)を記述していきます。テーブル定義を行う際、`db/base_class`に定義しているSQLAlchemyのBaseクラスを継承します。

ここでは、テーブルごとにファイル分けします。

```sh
models
├── __init__.py
├── user.py         # Userテーブル定義
└── item.py         # Itemテーブル定義
```

`models/user.py`の記述例
```python
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_superuser = Column(Boolean, default=False)
```

### main.py
`api/api.py`で1つにまとめた`router`を`app=FastAPI()`に加えます。

記述例
```python
from fastapi import FastAPI

from app.api.api import api_router

app = FastAPI()

app.include_router(api_router)
```

ここで定義した`app`をuvicornなどを使って、APIサーバーを起動します。
```sh
uvicron run app.main:app --host 0.0.0.0 --reload --port 8000
```


## 参考
FastAPI公式が作成しているテンプレートプロジェクト[full-stack-fastapi-template](https://github.com/tiangolo/full-stack-fastapi-template)の[バージョン0.5.0](https://github.com/tiangolo/full-stack-fastapi-template/tree/0.5.0)を参考に作成しました。

## QA
ここでは、ちょっとした疑問に答えていきます。

### DB操作が発生しないpythonでの処理を記述する場所は、どこが良いか？
ここでは、特に決まりはありませんが、`app/services`ディレクトリを作成し、そこに配置していきます。`app/services`配下もカテゴリごとにディレクトリを作成し、ソースコードを配置するのが良いでしょう。

### なぜ最新版ではなく、0.5.0を参考にしたのか？
最新版0.6.0では、ORMライブラリとして、[SQLModel](https://sqlmodel.tiangolo.com/)が利用されています。SQLModelは、pydanticを利用してDBのテーブル定義が行える強力なツールですが、まだ新しいライブラリのため、ドキュメントが少ない。そのため、PythonのORMライブラリとして最も利用されているSQLAlchemyを使用しているバージョン0.5.0を採用しました。

