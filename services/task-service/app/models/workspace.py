from uuid import UUID, uuid4

from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Workspace(Base, TimestampMixin):
    __tablename__ = "workspaces"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    # owner_id points to a user in the AUTH service's database.
    # NO ForeignKey — you cannot FK across a service boundary.
    owner_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), index=True, nullable=False)

    def __repr__(self) -> str:
        return f"<Workspace id={self.id} name={self.name}>"