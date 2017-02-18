"""empty message

Revision ID: cb8283483169
Revises: 
Create Date: 2017-02-11 14:05:15.774217

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb8283483169'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('factor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book', sa.String(length=120), nullable=True),
    sa.Column('label', sa.String(length=120), nullable=True),
    sa.Column('Factor1', sa.Float(), nullable=True),
    sa.Column('Factor2', sa.Float(), nullable=True),
    sa.Column('Factor3', sa.Float(), nullable=True),
    sa.Column('variable', sa.String(length=120), nullable=True),
    sa.Column('clust', sa.String(length=120), nullable=True),
    sa.Column('poet', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('response',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book', sa.String(length=120), nullable=True),
    sa.Column('project', sa.Integer(), nullable=True),
    sa.Column('stretch', sa.Integer(), nullable=True),
    sa.Column('prosodic', sa.Integer(), nullable=True),
    sa.Column('momentum', sa.Integer(), nullable=True),
    sa.Column('sentencelength', sa.Integer(), nullable=True),
    sa.Column('prosaic', sa.Integer(), nullable=True),
    sa.Column('notissue', sa.Integer(), nullable=True),
    sa.Column('bigabstraction', sa.Integer(), nullable=True),
    sa.Column('memorize', sa.Integer(), nullable=True),
    sa.Column('pagecanvas', sa.Integer(), nullable=True),
    sa.Column('communicationvolume', sa.Integer(), nullable=True),
    sa.Column('contentvolume', sa.Integer(), nullable=True),
    sa.Column('shock', sa.Integer(), nullable=True),
    sa.Column('humor', sa.Integer(), nullable=True),
    sa.Column('sound', sa.Integer(), nullable=True),
    sa.Column('argument', sa.Integer(), nullable=True),
    sa.Column('structural', sa.Integer(), nullable=True),
    sa.Column('otherattributes', sa.Integer(), nullable=True),
    sa.Column('loose', sa.Integer(), nullable=True),
    sa.Column('historical', sa.Integer(), nullable=True),
    sa.Column('associative', sa.Integer(), nullable=True),
    sa.Column('variedregister', sa.Integer(), nullable=True),
    sa.Column('syntax', sa.Integer(), nullable=True),
    sa.Column('breakrules', sa.Integer(), nullable=True),
    sa.Column('mainpoint', sa.Integer(), nullable=True),
    sa.Column('meta', sa.Integer(), nullable=True),
    sa.Column('scan', sa.Integer(), nullable=True),
    sa.Column('abstractthinking', sa.Integer(), nullable=True),
    sa.Column('explanation', sa.Integer(), nullable=True),
    sa.Column('realworld', sa.Integer(), nullable=True),
    sa.Column('singleself', sa.Integer(), nullable=True),
    sa.Column('authorflag', sa.Integer(), nullable=True),
    sa.Column('flag0', sa.Integer(), nullable=True),
    sa.Column('flag1', sa.Integer(), nullable=True),
    sa.Column('flag2', sa.Integer(), nullable=True),
    sa.Column('consistent', sa.Integer(), nullable=True),
    sa.Column('shortline', sa.Integer(), nullable=True),
    sa.Column('mediumline', sa.Integer(), nullable=True),
    sa.Column('longline', sa.Integer(), nullable=True),
    sa.Column('asserts', sa.Integer(), nullable=True),
    sa.Column('absurd', sa.Integer(), nullable=True),
    sa.Column('logical', sa.Integer(), nullable=True),
    sa.Column('low', sa.Integer(), nullable=True),
    sa.Column('middle', sa.Integer(), nullable=True),
    sa.Column('high', sa.Integer(), nullable=True),
    sa.Column('coherentlinear', sa.Integer(), nullable=True),
    sa.Column('coherentjumping', sa.Integer(), nullable=True),
    sa.Column('absurdsurreal', sa.Integer(), nullable=True),
    sa.Column('causeeffectyes', sa.Integer(), nullable=True),
    sa.Column('causeeffectno', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('response')
    op.drop_table('factor')
    # ### end Alembic commands ###
