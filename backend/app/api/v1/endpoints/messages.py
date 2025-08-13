from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json

from .... import crud, models, schemas
from ....database import get_db
from ....core.security import get_current_active_user
from ....core.websocket import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.get("/", response_model=List[schemas.Message])
def read_messages(
    room_id: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve messages for a specific room with pagination.
    """
    return crud.message.get_by_room(
        db, room_id=room_id, skip=skip, limit=limit
    )

@router.post("/", response_model=schemas.Message)
def create_message(
    message_in: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Create a new message.
    """
    message_in.sender_id = current_user.id
    return crud.message.create(db, obj_in=message_in)

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    token: str,
    db: Session = Depends(get_db),
):
    """
    WebSocket endpoint for real-time messaging.
    """
    try:
        # Authenticate user from token
        user = await manager.authenticate_user(db, token)
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
        # Connect to the room
        await manager.connect(websocket, room_id, user)
        
        try:
            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Handle different types of messages
                if message_data["type"] == "message":
                    # Save message to database
                    message_in = schemas.MessageCreate(
                        content=message_data["content"],
                        room_id=room_id,
                        recipient_id=message_data.get("recipient_id")
                    )
                    message = crud.message.create_with_sender(
                        db=db, obj_in=message_in, sender_id=user.id
                    )
                    
                    # Broadcast message to all clients in the room
                    await manager.broadcast_message(
                        room_id=room_id,
                        message={
                            "type": "message",
                            "content": message.content,
                            "sender_id": message.sender_id,
                            "created_at": message.created_at.isoformat(),
                            "sender_name": user.full_name,
                        }
                    )
                    
                elif message_data["type"] == "typing":
                    # Broadcast typing indicator
                    await manager.broadcast_message(
                        room_id=room_id,
                        message={
                            "type": "typing",
                            "user_id": user.id,
                            "user_name": user.full_name,
                            "is_typing": message_data["is_typing"]
                        },
                        exclude=[websocket]
                    )
                    
        except WebSocketDisconnect:
            manager.disconnect(websocket, room_id)
            await manager.broadcast_message(
                room_id=room_id,
                message={
                    "type": "user_left",
                    "user_id": user.id,
                    "user_name": user.full_name
                }
            )
            
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        await websocket.close()

@router.put("/{message_id}/read", response_model=schemas.Message)
def mark_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Mark a message as read.
    """
    message = crud.message.get(db, id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.recipient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to mark this message as read",
        )
    return crud.message.mark_as_read(db, db_obj=message)
