"""
schemas.py — Pydantic request/response schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArticleCreate(BaseModel):
    title:       str
    category:    str
    impact:      str
    description: str
    body:        str
    env_impact:  str
    ethics:      str
    actions:     str        # newline-separated list stored as plain text
    emoji:       Optional[str] = "🌍"
    color:       Optional[str] = "#1a2820"
    featured:    Optional[bool] = False


class ArticleOut(BaseModel):
    id:          int
    title:       str
    category:    str
    impact:      str
    description: str
    body:        str
    env_impact:  str
    ethics:      str
    actions:     str
    emoji:       Optional[str]
    color:       Optional[str]
    featured:    bool
    date_added:  Optional[datetime]

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str
