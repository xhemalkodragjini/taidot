from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from database.schema import UserLogin, User
from database.models import SessionLocal, User as DBUser
from sqlalchemy.orm import Session
from enum import StrEnum, auto

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/user/create")
def create_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter((DBUser.username == user.username) | (DBUser.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    new_user = DBUser(username=user.username, email=user.email, password=user.password, profile={})
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return user

class LoginStatus(StrEnum):
    SUCCESS = auto()
    FAILURE = auto()

class UserLoginEmailPass(BaseModel):
    email: str
    password: str

@router.post("/user/login", response_model=UserLogin)
def login_user(login_data: UserLoginEmailPass, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.email == login_data.email, DBUser.password == login_data.password).first()
    if db_user:
        return UserLogin(username=db_user.username, email=db_user.email, password=db_user.password)
    raise HTTPException(status_code=401, detail="Invalid credentials")