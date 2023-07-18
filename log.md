# React + FastAPI Template 作成ログ

## Reactの準備
### frontend/Dockerfileの作成
[node.js](https://nodejs.org/en)のバージョンの確認。LTSのものを選ぶと良い。
[dockerでサポートされているnode.js](https://hub.docker.com/_/node/?tab=description&page=1&ordering=last_updated)のバージョンを確認（ここでは、18.16.1-alpineを選択）し、以下のような内容のDockerfileを作成する。

```dockerfile
FROM node:18.16.1-alpine
WORKDIR /usr/src/app/frontend
```
- FROM
  ビルドするDockerイメージのベースとなるイメージを指定
- WORKDIR
  コンテナ内で作業するディレクトリを設定

### docker-compose.ymlの作成

```yaml
# versionは、3系
version: '3'
# Serviceを設定する
services:
  # Service名は、自由に決めていい
  frontend:
    # DockerfileまでのPath
    build: ./frontend
    # 環境変数を定義する
    environment:
      # Node.jsのグローバル変数: 開発用途なのでdevelopmentを指定
      - NODE_ENV=development
    # ホストマシン:コンテナ => ファイルを共有するための設定
    volumes:
      - ./frontend:/usr/src/app/frontend
    # Dockerコンテナ内で実行されるコマンドを指定する
    command: sh -c 'cd frontend && npm start'
    # ホストマシンPort番号:コンテナのPost番号
    ports:
      - 3000:3000
    # CLI画面の操作をできるようにする
    tty: true
```

### dockerイメージのビルド
docker-compose.ymlがあるフォルダで以下のコマンドを実行し、Dockerイメージのビルドを行う。
```shell
$ docker-compose build
```

### Docker経由でCreate react app
frontendサービス内で、create-react-appを行う。
```shell
$ docker-compose run --rm frontend sh -c 'npx create-react-app my-app --template typescript'
```
- docker-compose run コマンドを使用して、frontend サービスを実行。
- --rm オプションで、コマンドの実行が終了したらコンテナを自動的に削除されるように設定。
- sh -c で、実行するコマンドを指定する。
- npx create-react-app frontend --template typescript は一時的なコンテナ内で実行されるコマンドです。

### Dockerコンテナの実行
以下コマンドを実行。バックグラウンドで実行する場合は`-d`オプションを付ける。
```shell
$ docker-compose up (-d)
```

### Windows PCでReactのホットリロードを有効化する
create react appで作成したフォルダ内のpackage.jsonを以下のように編集。

```json
"scripts": {
    "start": "WATCHPACK_POLLING=true react-scripts start",
    "build": ...
  },
```

### (付録)Docker環境にnpm install
今後、この環境にnpm installで新しくパッケージをインストールする場合は、以下の手順で行います。

## Python(FastAPI)の準備
### backend/Dockerfileの作成
使いたいバージョンのpythonを選ぶ。
dockerでサポートされているpythonのバージョンは、[こちら](https://hub.docker.com/_/python)から確認。

```dockerfile
FROM python:3.11.4
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app/backend

# pipを使ってpoetryをインストール
RUN pip install poetry

# poetryの定義ファイルをコピー (存在する場合)
COPY pyproject.toml* poetry.lock* ./

# poetryでライブラリをインストール (pyproject.tomlが既にある場合)
RUN poetry config virtualenvs.in-project true
RUN if [ -f pyproject.toml ]; then poetry install --no-root; fi

# uvicornのサーバーを立ち上げる
ENTRYPOINT ["poetry", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--reload", "--port", "8000"]
```

### docker-compose.ymlの編集

```yml
# versionは、3系
version: '3'
# Serviceを設定する
services:
  # Service名は、自由に決めていい
  frontend:
    ...

  # 追加
  backend:
    build: ./backend
    volumes:
      - .dockervenv:/usr/src/app/.venv
      - ./backend:/usr/src/app
    ports:
      - 8000:8000
```

### dockerイメージのビルド
docker-compose.ymlがあるフォルダで以下のコマンドを実行し、Dockerイメージのビルドを行う。
```shell
$ docker-compose build
```

### poetryによるPython環境のセットアップ

以下コマンドでdocker上のpythonでpoetryの初期化を行う。
fastapiとuvicornは、dependencyに追加する。
```shell
$ docker-compose run --entrypoint "poetry init --name backend --dependency fastapi --dependency uvicorn[standard]" backend
```

### FastAPI, uvicornのインストール
fastapiとuvicornは、既にdependencyに追加しているので、
```shell
$ docker-compose run --entrypoint "poetry install --no-root" backend
```

### その他のライブラリのインストール
**sqlalchemyのインストール例**

backendのdockerを立ち上げた後。
```shell
$ docker-compose up backend
```

以下のコマンドにより"backend" コンテナの中で "poetry add sqlalchemy" を実行。
```shell
$ docker-compose exec backend poetry add sqlalchemy
```

## DBの準備
### docker-compose.ymlの編集
ここでは、PostgreSQLを使う場合の例を示します。

```yml
version: '3'
services:
  frontend:
    ...
  
  backend:
    ...

  # 追加
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: test
    volumes:
      - ./postgresql_data:/var/lib/postgresql/data
    ports:
      - 5432:5432
```

#### 動作確認
Docker起動後、
```shell
$ docker-compose up
```
以下のコマンドで、dbコンテナ内で`psql -U postgres -d test`を実行し、testデータベースに接続する。
```shell
$ docker-compose exec db psql -U postgres -d test
```

以下のように表示されるので、`\l`でデータベース一覧を表示できます。
```psql
test#=
```
データベース一覧で以下のような表示がされれば、正常に動作しています。
```
   Name    |  Owner   | Encoding |  Collate   |   Ctype    | ICU Locale | Locale Provider |   Access privileges
-----------+----------+----------+------------+------------+------------+-----------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/postgres          +
           |          |          |            |            |            |                 | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/postgres          +
           |          |          |            |            |            |                 | postgres=CTc/postgres
 test      | postgres | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            |
(4 rows)
```

### マイグレーション
マイグレーション用のスクリプトを以下のように作ります。
定義したmodelsを読み込んで置かないとテーブルが作られないので、
`import app.models`としています。

```python
from sqlalchemy import create_engine

from app.db.base import Base
from app.core.config import settings
import app.models


def reset_database(engine):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, echo=True)
    reset_database(engine=engine)
```

BackendのDocker起動後、
```shell
$ docker-compose up backend
```
以下のコマンドで、backendコンテナ内で`poetry run python -m app.migrate`を実行し、migrateを実行する。
```shell
$ docker-compose exec backend poetry run python -m app.migrate
```
