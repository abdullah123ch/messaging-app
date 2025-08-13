from .base import BaseModel
from .user import User
from .message import Message

# Import all models here so they are registered with SQLAlchemy
__all__ = ["BaseModel", "User", "Message"]
