"""name nullable false

Revision ID: 86a593a506e9
Revises: 0df573d8286f
Create Date: 2024-06-25 04:04:54.075289

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '86a593a506e9'
down_revision: Union[str, None] = '0df573d8286f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('task', 'name',
               existing_type=sa.VARCHAR(length=500),
               server_default='',
               nullable=False)
    op.alter_column('todo', 'name',
               existing_type=sa.VARCHAR(length=200),
               server_default='',
               nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todo', 'name',
               existing_type=sa.VARCHAR(length=200),
               server_default=None,
               nullable=True)
    op.alter_column('task', 'name',
               existing_type=sa.VARCHAR(length=500),
               server_default=None,
               nullable=True)
    # ### end Alembic commands ###
