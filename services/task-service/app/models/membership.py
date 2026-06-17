from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Membership(Base):
    __tablename__ = "memberships"

    # Composite primary key: one membership row per (workspace, user)
    workspace_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("workspaces.id", ondelete="CASCADE"),  # FK OK — same service
        primary_key=True,
    )
    # user_id points to the AUTH service — NO ForeignKey across services
    user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    role: Mapped[str] = mapped_column(String(20), default="member", nullable=False)  # owner/admin/member

    def __repr__(self) -> str:
        return f"<Membership ws={self.workspace_id} user={self.user_id} role={self.role}>"