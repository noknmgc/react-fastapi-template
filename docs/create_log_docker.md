# React + FastAPI Template 作成ログ（Docker）

ここでは、Dockerを使ったReact + FastAPIの環境構築について説明します。

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