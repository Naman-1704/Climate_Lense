"""
models.py — SQLAlchemy ORM Models
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class Article(Base):
    __tablename__ = "articles"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(300), nullable=False)
    category    = Column(String(50), nullable=False)   # flood, heatwave, pollution, etc.
    impact      = Column(String(20), nullable=False)   # high, med, low
    description = Column(Text, nullable=False)          # short summary
    body        = Column(Text, nullable=False)          # full article text
    env_impact  = Column(Text, nullable=False)          # environmental analysis
    ethics      = Column(Text, nullable=False)          # ethical perspective
    actions     = Column(Text, nullable=False)          # newline-separated action steps
    emoji       = Column(String(10), default="🌍")
    color       = Column(String(20), default="#1a2820")
    featured    = Column(Boolean, default=False)
    date_added  = Column(DateTime(timezone=True), server_default=func.now())
