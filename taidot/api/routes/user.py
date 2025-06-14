from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from .schema.user import UserLogin, UserProfile, User

app = FastAPI()

# Mock database
users_db = []

@app.post("/user/create", response_model=User)
def create_user(user: User):
    # Check if the username or email already exists
    for existing_user in users_db:
        if existing_user.login.username == user.login.username or existing_user.login.email == user.login.email:
            raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Add user to the mock database
    users_db.append(user)
    return user

class LoginStatus(Enum):
    SUCCESS = auto()
    FAILURE = auto()


@app.post("/user/login", response_model=UserLogin)
def login_user(login_data: UserLogin):
    # Check if the user exists in the mock database
    for existing_user in users_db:
        if (existing_user.login.username == login_data.username and
            existing_user.login.email == login_data.email and
            existing_user.login.password == login_data.password):
            return LoginStatus.SUCCESS
    
    raise HTTPException(status_code=401, detail="Invalid credentials")