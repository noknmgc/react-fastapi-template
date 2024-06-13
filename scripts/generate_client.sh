#!/bin/bash

# 実行条件
# - dockerがインストールされていること
# - dockerコンテナ上で実行しないこと

# スクリプトがあるディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOME_DIR="$SCRIPT_DIR/.."

# 定数の設定
OPENAPI_URL="http://localhost:8000/openapi.json"
OPENAPI_FILE="$HOME_DIR/openapi.json"
OUTPUT_DIR="/frontend/src/api" # HOME_DIRからの相対パス。HOME_DIRより上位のパスは指定不可
GENERATOR="typescript-axios" # 生成するクライアントコードの言語を指定

# OpenAPI JSONファイルを取得
echo "Fetching OpenAPI spec from $OPENAPI_URL"
curl -o $OPENAPI_FILE $OPENAPI_URL

# 取得したJSONファイルを確認
if [ -f "$OPENAPI_FILE" ]; then
    echo "OpenAPI spec downloaded successfully."

    # OpenAPI Generatorを使用してクライアントコードを生成
    echo "Generating client code..."
    docker run --rm \
        -v $HOME_DIR:/local openapitools/openapi-generator-cli generate \
        -i /local/openapi.json \
        -g $GENERATOR \
        -o /local/$OUTPUT_DIR

    if [ $? -eq 0 ]; then
        echo "Client code generated successfully in $OUTPUT_DIR."
    else
        echo "Failed to generate client code."
    fi
else
    echo "Failed to download OpenAPI spec."
fi