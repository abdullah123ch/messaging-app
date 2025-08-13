from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from ..models import Message
from ..schemas.message import MessageCreate, MessageUpdate
from .base import CRUDBase

class CRUDMessage(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def create_with_sender(
        self, db: Session, *, obj_in: MessageCreate, sender_id: int
    ) -> Message:
        db_obj = Message(
            content=obj_in.content,
            sender_id=sender_id,
            recipient_id=obj_in.recipient_id,
            room_id=obj_in.room_id,
            is_read=False,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_multi_by_room(
        self, db: Session, *, room_id: str, skip: int = 0, limit: int = 100
    ) -> List[Message]:
        return (
            db.query(self.model)
            .filter(Message.room_id == room_id)
            .order_by(Message.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_unread_messages(
        self, db: Session, *, recipient_id: int, skip: int = 0, limit: int = 100
    ) -> List[Message]:
        return (
            db.query(self.model)
            .filter(
                Message.recipient_id == recipient_id,
                Message.is_read == False
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def mark_as_read(self, db: Session, *, db_obj: Message) -> Message:
        db_obj.is_read = True
        db_obj.read_at = datetime.utcnow()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def mark_all_as_read(
        self, db: Session, *, recipient_id: int, sender_id: int
    ) -> List[Message]:
        messages = db.query(self.model).filter(
            Message.sender_id == sender_id,
            Message.recipient_id == recipient_id,
            Message.is_read == False
        ).all()
        
        for message in messages:
            message.is_read = True
            message.read_at = datetime.utcnow()
            db.add(message)
        
        db.commit()
        return messages

message = CRUDMessage(Message)
