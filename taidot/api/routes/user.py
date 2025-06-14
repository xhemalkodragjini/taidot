from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database.schema import UserLogin, User
from enum import StrEnum, auto

router = APIRouter()

# Mock database
users_db = [UserLogin(**{
  "username": "jcyri",
  "email": "user@example.com",
  "password": "stringst"
})]

@router.post("/user/create", )
def create_user(user: UserLogin):
    # Check if the username or email already exists
    for existing_user in users_db:
        if existing_user.login.username == user.login.username or existing_user.login.email == user.login.email:
            raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Add user to the mock database
    users_db.append(user)
    

class LoginStatus(StrEnum):
    SUCCESS = auto()
    FAILURE = auto()


class UserLoginEmailPass(BaseModel):
    email: str
    password: str


@router.post("/user/login", response_model=UserLogin)
def login_user(login_data: UserLoginEmailPass):
    # Check if the user exists in the mock database
    for existing_user in users_db:
        if (existing_user.email == login_data.email and
            existing_user.password == login_data.password):
            return existing_user
    
    raise HTTPException(status_code=401, detail="Invalid credentials")