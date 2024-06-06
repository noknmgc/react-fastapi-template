<!-- omit in toc -->
# React + FastAPI Template 作成ログ（ローカル）

ここでは、ローカルマシンでReact + FastAPIの環境構築する方法について説明します。

<!-- omit in toc -->
## 目次
- [React](#react)
  - [Node.jsのインストール](#nodejsのインストール)
  - [Reactのプロジェクトテンプレート作成](#reactのプロジェクトテンプレート作成)
  - [ディレクトリ移動](#ディレクトリ移動)
  - [ライブラリのインストール](#ライブラリのインストール)
  - [開発サーバーの起動](#開発サーバーの起動)
  - [ビルド](#ビルド)
- [FastAPI](#fastapi)
  - [Minicondaのインストール、仮想環境作成](#minicondaのインストール仮想環境作成)
  - [poetryのインストール](#poetryのインストール)
  - [poetryの初期化](#poetryの初期化)
  - [依存ライブラリのインストール](#依存ライブラリのインストール)
  - [FastAPI動作確認用スクリプト作成](#fastapi動作確認用スクリプト作成)
  - [API起動](#api起動)


## React

### Node.jsのインストール
以下のURLよりインストール

https://nodejs.org/en

XX.XX.XX LTSの方をインストールしてください。

※すでにNode.jsがインストールされており、バージョンを変更したくない場合は、NVMを使ってNode.jsのバージョン管理をしましょう。
[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

### Reactのプロジェクトテンプレート作成
Viteを使って作成します。以下のコマンドを実行します。

```shell
npm create vite@latest
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

### ディレクトリ移動

Viteで作成されたディレクトリ内のファイルを全てフロントエンドのコードを管理さいたディレクトリ内に移動します。もとのディレクトリは削除します。

ここでは、frontendフォルダに移動させます。

```
.
└─── frontend
    │   .eslintrc.cjs
    │   .gitignore
    │   index.html
    │   package.json
    │   README.md
    │   tsconfig.json
    │   tsconfig.node.json
    │   vite.config.ts
    │
    ├─── public
    │       vite.svg
    │
    └─── src
        │   App.css
        │   App.tsx
        │   index.css
        │   main.tsx
        │   vite-env.d.ts
        │
        └─── assets
                react.svg
```

### ライブラリのインストール
以下のコマンドでライブラリをインストールします。

```shell
cd frontend
npm install
```

### 開発サーバーの起動
以下のコマンドで開発サーバーが起動できます。

```shell
cd frontend
npm run dev
```

これで、Vite + Reactの画面が表示されれば、OKです。
デフォルトでは、[http://localhost:5173/](http://localhost:5173/)で確認できます。

### ビルド
以下のコマンドでビルドができます。

```shell
cd frontend
npm run build
```

## FastAPI

### Minicondaのインストール、仮想環境作成

以下のサイトからMinicondaのインストーラーを取得し、インストーラーに従ってMinicondaをインストールしてください。
[https://docs.anaconda.com/free/miniconda/index.html](https://docs.anaconda.com/free/miniconda/index.html)

インストールの際、環境変数も作成するオプションも付けてください。

Anaconda Promptを起動し、以下のコマンドを仮想環境作成してください。仮想環境名、Pythonのバージョンは必要に応じて変更してください。

```shell
conda create -n {仮想環境名} python={pythonのバージョン}
```

ここでは、以下のように実行します。
```shell
conda create -n fastapi python=3.12
```

### poetryのインストール
以下のコマンドで仮想環境をアクティベートします。

```shell
conda activate {仮想環境名}
```

```shell
conda activate fastapi
```

以下のコマンドでpoetryをインストールします。
```shell
pip install poetry
```

### poetryの初期化
FastAPIを管理するディレクトリを作成します。ここでは、backendディレクトリを作成します。

```
.
└─── backend
```

backendディレクトリでpoetryの初期化を行います。

```shell
cd backend
poetry init
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

### 依存ライブラリのインストール

以下のコマンドで使用するライブラリのインストールを行います。

```shell
poetry add {ライブラリ名}
```

ここでは、fastapiとuvicornをインストールします。

```shell
poetry add fastapi "uvicorn[standard]"
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

### API起動

以下のコマンドで起動します。

```shell
cd backend
poetry run uvicorn app.main:app --host 0.0.0.0 --reload --port 8000
```

これで、FastAPIのSwaggerUIを確認できれば成功です。
([localhost:8000/docs](http://localhost:8000/docs)で確認できます。)
