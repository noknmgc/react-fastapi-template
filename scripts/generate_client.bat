@echo off
setlocal enabledelayedexpansion

rem 実行条件
rem - dockerがインストールされていること
rem - dockerコンテナ上で実行しないこと

rem スクリプトがあるディレクトリを取得
for %%I in (%~dp0) do set SCRIPT_DIR=%%~fI

rem 定数の設定
set "HOME_DIR=%SCRIPT_DIR%/.."
set "OPENAPI_URL=http://localhost:8000/openapi.json"
set "OPENAPI_FILE=%HOME_DIR%openapi.json"
rem OUTPUT_DIRは、HOME_DIRからの相対パスを記述する
rem ただしHOME_DIRより上位のディレクトリには出力できない
set "OUTPUT_DIR=/frontend/src/api"
set "GENERATOR=typescript-axios"

rem OpenAPI JSONファイルを取得
echo Fetching OpenAPI spec from %OPENAPI_URL%
curl -o %OPENAPI_FILE% %OPENAPI_URL%

rem 取得したJSONファイルを確認
if exist "%OPENAPI_FILE%" (
    echo OpenAPI spec downloaded successfully.

    rem OpenAPI Generatorを使用してクライアントコードを生成
    echo Generating client code...
    docker run --rm ^
        -v %HOME_DIR%:/local openapitools/openapi-generator-cli generate ^
        -i /local/openapi.json ^
        -g %GENERATOR% ^
        -o /local/%OUTPUT_DIR%

    if %errorlevel% equ 0 (
        echo Client code generated successfully in %OUTPUT_DIR%.
    ) else (
        echo Failed to generate client code.
    )
) else (
    echo Failed to download OpenAPI spec.
)

endlocal
pause