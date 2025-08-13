from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    room_id: str

class MessageCreate(MessageBase):
    recipient_id: Optional[int] = None  # None for group messages

class MessageUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=1000)
    is_read: Optional[bool] = None

class MessageInDBBase(MessageBase):
    id: int
    sender_id: int
    recipient_id: Optional[int]
    is_read: bool
    created_at: datetime
    updated_at: datetime
    read_at: Optional[datetime]

    class Config:
        from_attributes = True

class MessageInDB(MessageInDBBase):
    pass

class Message(MessageInDBBase):
    sender: 'User'
    recipient: Optional['User'] = None

class MessageInResponse(BaseModel):
    message: Message

# Update forward refs after all models are defined
from .user import User  # noqa
Message.update_forward_refs()
