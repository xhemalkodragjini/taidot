from pydantic import BaseModel, EmailStr, Field
from typing import Literal

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserProfile(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    surname: str = Field(..., min_length=1, max_length=50)
    country_of_living: str = Field(..., min_length=2, max_length=50)
    level_of_studies: Literal["high school", "university Bachelors", "university Masters"]
    current_gpa: float = Field(..., ge=0.0, le=4.0)

class User(BaseModel):
    login: UserLogin
    profile: UserProfile