# FastAPI
[FastAPI](https://fastapi.tiangolo.com/ja/)を利用したPythonのAPIです。

## 基本的な使い方(ローカル)
Dockerを使わずに、ローカルで実行する手順です。

### 要件
- Python 3.12
- [poetry](https://python-poetry.org/)

### インストール(初回のみ)
以下のコマンドでパッケージのインストールを行います。

```shell
poetry install --no-root
```

### 開発サーバーの起動
以下のコマンドでAPIサーバーを立ち上げます。ホストやポート番号は、適宜変更してください。

```shell
poetry run uvicorn app.main:app --host 0.0.0.0 --reload --port 8000
```

### デプロイ
Linuxへのデプロイでは、[gunicorn](https://gunicorn.org/)を使用することを推奨します。gunicornは、uvicornのプロセスマネージャーとして利用することができます。

### 注意点
- パッケージの追加・削除は、poetryの手順に従ってください。
