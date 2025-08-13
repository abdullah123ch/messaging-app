from typing import Dict, List, Set
from fastapi import WebSocket, status, Depends
from sqlalchemy.orm import Session
import json
from jose import jwt

from .. import models, schemas
from ..core import security
from ..database import get_db

class ConnectionManager:
    def __init__(self):
        # room_id -> set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # WebSocket -> user mapping
        self.connection_users: Dict[WebSocket, models.User] = {}
        # user_id -> set of WebSocket connections
        self.user_connections: Dict[int, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user: models.User):
        await websocket.accept()
        
        # Add connection to the room
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        self.active_connections[room_id].add(websocket)
        
        # Track user connections
        self.connection_users[websocket] = user
        if user.id not in self.user_connections:
            self.user_connections[user.id] = set()
        self.user_connections[user.id].add(websocket)
        
        # Notify others in the room that user has joined
        await self.broadcast_message(
            room_id=room_id,
            message={
                "type": "user_joined",
                "user_id": user.id,
                "user_name": user.full_name
            },
            exclude=[websocket]
        )

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections and websocket in self.active_connections[room_id]:
            self.active_connections[room_id].remove(websocket)
            
        # Clean up user tracking
        user = self.connection_users.pop(websocket, None)
        if user and user.id in self.user_connections:
            self.user_connections[user.id].discard(websocket)
            if not self.user_connections[user.id]:
                del self.user_connections[user.id]

    async def broadcast_message(self, room_id: str, message: dict, exclude: List[WebSocket] = None):
        if room_id not in self.active_connections:
            return
            
        if exclude is None:
            exclude = []
            
        for connection in self.active_connections[room_id]:
            if connection not in exclude:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending message: {e}")
                    self.disconnect(connection, room_id)

    async def send_direct_message(self, user_id: int, message: dict):
        """Send a message to all connections of a specific user"""
        if user_id not in self.user_connections:
            return
            
        for connection in self.user_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending direct message: {e}")
                # Find and remove the connection from all rooms
                for room_id in list(self.active_connections.keys()):
                    self.disconnect(connection, room_id)

    async def authenticate_user(
        self, 
        db: Session, 
        token: str
    ) -> models.User:
        """Authenticate user from JWT token"""
        if not token:
            return None
            
        try:
            payload = jwt.decode(
                token, 
                security.SECRET_KEY, 
                algorithms=[security.ALGORITHM]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
                
            user = db.query(models.User).filter(models.User.id == int(user_id)).first()
            return user if user and user.is_active else None
            
        except jwt.JWTError:
            return None
