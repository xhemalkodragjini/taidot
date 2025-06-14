from fastapi import APIRouter, HTTPException
from typing import List, Optional
from .user import users_db
from database.schema import Journey

router = APIRouter()

@router.get("/user/{username}/journeys", response_model=List[Journey])
def get_user_journeys(username: str):
    # Find the user by username
    user = next((u for u in users_db if u.login.username == username), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # For now, each user has only one journey (per schema), so return as a list
    return [user.journey] if user.journey else []

@router.get("/user/{username}/journey", response_model=Journey)
def get_user_journey(username: str):
    user = next((u for u in users_db if u.login.username == username), None)
    if not user or not user.journey:
        raise HTTPException(status_code=404, detail="User or journey not found")
    return user.journey
