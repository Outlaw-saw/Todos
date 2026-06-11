from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TodoCreate(BaseModel):
    title: str
    due_time: Optional[str] = None


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    due_time: Optional[str] = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    due_time: Optional[str] = None
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str
