from typing import Any, Iterator
import re
from datetime import datetime

from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column, DateTime, ForeignKey, Integer


@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return to_snake_case(cls.__name__)


class TimestampMixin:
    """
    作成者、作成日、更新者、更新日といった共通のフィールドを自動的に含む Mixinクラスです。
    このクラスは、作成者と更新者を外部キーとして扱い、これらが指すレコードが削除された場合には NULL に設定されるようになっています。

    Attributes
    ----------
    __tablename__ : str
        テーブル名をクラス名のスネークケースに設定します。
    created_by : int
        レコードを作成したユーザーのID。外部キーとして users テーブルの id を参照します。ユーザーが削除されると NULL に設定されます。
    created_at : datetime
        レコードの作成日時。デフォルトでは現在の日時が設定されます。
    updated_by : int
        レコードを最後に更新したユーザーのID。外部キーとして users テーブルの id を参照します。ユーザーが削除されると NULL に設定されます。
    updated_at : datetime
        レコードの最終更新日時。デフォルトでは現在の日時が設定され、レコードが更新されるたびにこの値が更新されます。
    """

    created_by = Column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    updated_by = Column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at = Column(
        DateTime,
        default=datetime.now,
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        nullable=False,
    )


def parse_words(string: str) -> Iterator[str]:
    """パスカルケース、キャメルケース、スネークケース、ケバブケースの文字列を単語ごとに分割してイテレータを返す。

    Examples
    --------
    >>> word_iter = parse_words("OriginalPascalCase")
    >>> [word for word in word_iter]
    ["Original", "Pascal", "Case"]

    Parameters
    ----------
    string : str
        パスカルケース、キャメルケース、スネークケース、ケバブケースの文字列

    Yields
    ------
    Iterator[str]
        分割した単語を1つ1つ返すイテレータ
    """
    for block in re.split(r"[ _-]+", string):
        for match in re.finditer(r"[A-Za-z][^A-Z]+", block):
            yield match.group(0)


def to_snake_case(string: str) -> str:
    """与えられた文字列をスネークケースに変換する関数。

    Examples
    --------
    >>> to_snake_case("OriginalPascalCase")
    original_pascal_case
    >>> to_snake_case("original-kebab-case")
    original_kebab-case

    Parameters
    ----------
    string : str
        パスカルケース、キャメルケース、スネークケース、ケバブケースの文字列

    Returns
    -------
    str
        スネークケースの文字列
    """
    word_iter = parse_words(string)
    return "_".join(word.lower() for word in word_iter)
