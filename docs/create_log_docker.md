<!-- omit in toc -->
# React + FastAPI Template 作成ログ（Docker）

ここでは、Dockerを使ったReact + FastAPIの環境構築について説明します。

<!-- omit in toc -->
## 目次
- [React](#react)
  - [frontend/Dockerfileの作成](#frontenddockerfileの作成)
  - [docker-compose.ymlの作成](#docker-composeymlの作成)
  - [Reactのテンプレートプロジェクト作成](#reactのテンプレートプロジェクト作成)
  - [frontend/vite.config.ts修正](#frontendviteconfigts修正)
  - [frontend/Dockerfile修正](#frontenddockerfile修正)
  - [docker-compose.yml修正](#docker-composeyml修正)
  - [起動](#起動)
  - [ホストマシンでのインストール](#ホストマシンでのインストール)
- [FastAPI](#fastapi)
  - [backend/Dockerfileの作成](#backenddockerfileの作成)
  - [docker-compose.yml追加](#docker-composeyml追加)
  - [poetryの初期化](#poetryの初期化)
  - [ライブラリのインストール（必要最低限）](#ライブラリのインストール必要最低限)
  - [FastAPI動作確認用スクリプト作成](#fastapi動作確認用スクリプト作成)
  - [backend/Dockerfile修正](#backenddockerfile修正)
  - [起動](#起動-1)
  - [ホストマシンでのインストール](#ホストマシンでのインストール-1)


## React

### frontend/Dockerfileの作成
[node.js](https://nodejs.org/en)のバージョンの確認。LTSのものを選ぶと良い。
[dockerでサポートされているnode.js](https://hub.docker.com/_/node/?tab=description&page=1&ordering=last_updated)のバージョンを確認（ここでは、18.16.1-alpineを選択）し、以下のような内容のDockerfileを作成する。

```
.
└─── frontend
    └─── Dockerfile
```

`frontend/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app
```

- FROM
  ビルドするDockerイメージのベースとなるイメージを指定
- WORKDIR
  コンテナ内で作業するディレクトリを設定

### docker-compose.ymlの作成

Dockerfileをdocker-composeから操作できるように、以下のファイルを作成します。

`docker-compose.yml`
```yml
services:
  frontend:
    build: ./frontend
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
```

### Reactのテンプレートプロジェクト作成
まずは、docker-composeでReactのテンプレートプロジェクトを作成します。以下のコマンドを実行してください。

```shell
docker-compose build
docker-compose run --rm frontend sh -c 'npm create vite@latest'
```

viteから聞かれる質問に対しては、以下のように答えてください。
※Project nameは各々のプロジェクトに合った名前にしてください。

```shell
? Project name: › react-fastapi-template
? Select a framework: › - Use arrow-keys. Return to submit.
    Vanilla
    Vue
❯   React
    Preact
    Lit
    Svelte
    Solid
    Qwik
    Others
? Select a variant: › - Use arrow-keys. Return to submit.
    TypeScript
❯   TypeScript + SWC
    JavaScript
    JavaScript + SWC
    Remix ↗
```

そうすると、フロントエンド配下に以下のようなディレクトリが作成されます。

```
.
└─── frontend
    └─── react-fastapi-template
```

以下のコマンドで作成されたディレクトリ配下のファイルを全てfrontendディレクトリに移動し、作成されたディレクトリは削除します。

```shell
docker-compose run --rm frontend sh -c 'mv ./react-fastapi-template/* ./react-fastapi-template/.[^\.]* ./ && rm -r ./react-fastapi-template'
```

### frontend/vite.config.ts修正
次にviteのサーバーの設定を変更します。

`frontend/vite.config.ts`
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 開発サーバーを公開
    port: 3000, // ポート3000
    watch: {
      // 開発サーバーのリフレッシュ間隔を大きくする(負荷軽減のため)
      usePolling: true,
      interval: 1000,
    },
  },
});
```



### frontend/Dockerfile修正
これで、Reactのテンプレートが作成できたので、Dockerfileでこのテンプレートを起動するように変更しましょう。

`frontend/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

CMD ["npm", "run", "dev"]
```

### docker-compose.yml修正

ホストマシンでは、npm installしたnode_modulesを同期しないので、frontendのvolumesに設定を加えます。

`docker-compose.yml`
```yml
services:
  frontend:
    build: ./frontend
    environment:
      - NODE_ENV=development
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
```

### 起動
以下のコマンドで起動します。
※npm installが入るので、buildは少々時間がかかります。

```shell
docker-compose build
docker-compose up
```

これで、Vite + Reactの画面が表示されれば、OKです。

### ホストマシンでのインストール
ホストマシンでソースコードを編集する際、エディタがライブラリを認識している方が、編集しやすいので、インストールします。

```shell
cd frontend
npm install
```

## FastAPI

### backend/Dockerfileの作成
利用したいpythonのバージョンを確認し、Dockerでサポートされているものを選ぶ。サポートされているPythonは[こちら](https://hub.docker.com/_/python)。

以下のファイルを作成します。

`backend/Dockerfile`
```dockerfile
FROM python:3.12-alpine

WORKDIR /app

RUN apk update
RUN apk add curl

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false
```

### docker-compose.yml追加
docker-compose.ymlにbackendを追加します。

`docker-compose.yml`
```yml
services:
  # 省略

  backend:
    build: ./backend
    volumes:
      - ./backend:/app
    ports:
      - 8000:8000
```

### poetryの初期化
以下のコマンドで、poetryの初期化を行います。

```shell
docker-compose build
docker-compose run --rm backend sh -c 'poetry init'
```

ここで、poetry initのインストールの質問に答えて、依存ライブラリを追加しても良いです。

この説明では、以下のように答えたとします。
```
Package name [app]:  react-fastapi-template
Version [0.1.0]: 
Description []: 
Author [None, n to skip]:  n
License []:  
Compatible Python versions [^3.12]:  

Would you like to define your main dependencies interactively? (yes/no) [yes] no
Would you like to define your development dependencies interactively? (yes/no) [yes] no
Generated file

[tool.poetry]
name = "react-fastapi-template"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.12"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"


Do you confirm generation? (yes/no) [yes]
```

### ライブラリのインストール（必要最低限）
以下のコマンドでライブラリをインストールしていきます。

ここでは、fastapiとuvicorn[standard]をインストールしていますが、他に必要なライブラリが分かっていれば、それも加えます。

```shell
docker-compose run --rm backend sh -c 'poetry add fastapi && poetry add "uvicorn[standard]"'
```

### FastAPI動作確認用スクリプト作成

以下のようなファイルを作成します。

`backend/app/main.py`
```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"API": "ACTIVE!"}
```

### backend/Dockerfile修正
DockerfileでuvicornサーバーでFastAPIが起動するように設定しましょう。

`backend/Dockerfile`
```dockerfile
FROM python:3.12-alpine

WORKDIR /app

RUN apk update
RUN apk add curl

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY ./pyproject.toml ./poetry.lock* /app/

RUN poetry install --no-root

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--reload", "--port", "8000"]
```

### 起動

以下のコマンドで起動します。
※npm installが入るので、buildは少々時間がかかります。

```shell
docker-compose build
docker-compose up
```

これで、FastAPIのSwaggerUIを確認できれば成功です。
([localhost:8000/docs](http://localhost:8000/docs)で確認できます。)

### ホストマシンでのインストール
ホストマシンでソースコードを編集する際、エディタがライブラリを認識している方が、編集しやすいので、インストールします。

**condaを使う場合**

仮想環境作成
```shell
conda create -n fastapi python=3.12
```

作成した環境でpoetryをインストール
```shell
conda activate fastapi
pip install poetry
```

poetryを使って依存ライブラリをインストール
```shell
cd backend
poetry install --no-root
```
