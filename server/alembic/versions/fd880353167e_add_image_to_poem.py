"""add image to poem

Revision ID: fd880353167e
Revises:
Create Date: 2026-06-06 18:33:57.275085
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'fd880353167e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('poems', sa.Column('image', sa.String(length=512), nullable=True))


def downgrade() -> None:
    op.drop_column('poems', 'image')
