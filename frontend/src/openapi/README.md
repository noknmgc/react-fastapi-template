# 自動生成されたクライアントコード
ここにあるファイル群は、[OpenAPI Generator](https://openapi-generator.tech/)により自動で生成されたAPIクライアントコードです。

## 生成する方法
生成用のスクリプトを用意しているので、それを実行するだけです。
スクリプト内のファイルパスなどは、必要に応じて変更してください。

- Windows
```batch
cd react-fastapi-template
./scripts/generate_client.bat
```

- Mac, Linux
```shell
cd react-fastapi-template
./scripts/generate_client.sh
```

## Dockerなしでの生成方法

### FastAPIからopenapi.jsonを取得
FastAPIは、自動的に`openapi.json`を生成します。デフォルトでは、`/openapi.json`から取得できます。FastAPIのサーバーを起動し、`/openapi.json`からjsonファイルを取得してください。

例えば、localhost:8000でFastAPIのサーバーを起動している場合、[http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)から取得できます。

curlを使うと便利です。活用してください。
```shell
curl -o ./openapi.json http://localhost:8000/openapi.json
```

### OpenAPI Generatorをインストール・実行

基本的に公式サイトの[CLI Installation](https://openapi-generator.tech/docs/installation)に従って、openapi generatorをインストール・実行すれば良いです。
※別途、JavaのRuntimeが必要になる場合があります。必要に応じてインストールしてください。

以下では、**npm**を使う方法を記述します。

#### インストール
グローバルにインストール、またはプロジェクトのdevDependenciesに加えます。

- グローバルにインストールする場合
```shell
npm install @openapitools/openapi-generator-cli -g
```
- プロジェクトのdevDependenciesにインストールする場合
```shell
npm install @openapitools/openapi-generator-cli -D
```

#### 実行
`npx`を使って、以下のコマンドで実行します。

```shell
npx @openapitools/openapi-generator-cli generate -i {openapi.jsonまでのパス} -g {生成したいコードの種類} -o {コードの出力場所}
```

※`npx`はまずグローバルで利用可能なライブラリを探して、無ければローカルを探しにいくので、グローバルにインストールした場合も、プロジェクトのdevDependenciesにインストールした場合も動作します。

生成できるコードの種類は、公式サイトの[Generators List](https://openapi-generator.tech/docs/generators)を確認してください。