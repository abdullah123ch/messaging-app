from .base import CRUDBase
from .crud_user import user
from .crud_message import message

# For a new basic CRUD you will need to import and add it here
__all__ = ["CRUDBase", "user", "message"]
