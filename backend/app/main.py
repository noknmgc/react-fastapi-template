from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.api.api import api_router

app = FastAPI()

app.include_router(api_router)


def use_route_names_as_operation_ids(app: FastAPI) -> None:
    """
    operation idをパスオペレーション関数の名前とする関数。
    参考 : https://fastapi.tiangolo.com/ja/advanced/path-operation-advanced-configuration/
    目的 : openapi generatorで、クライアントのコードを自動生成した時のメソッドの命名にoperation idが使われる。
        デフォルトの命名規則だと分かりにくいため、operation idを付与する。
    """
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name  # in this case, 'read_items'


use_route_names_as_operation_ids(app)
