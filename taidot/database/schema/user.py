from pydantic import BaseModel, EmailStr, Field
from enum import StrEnum
from .journey import Journey

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class LevelOfStudies(StrEnum):
    HIGH_SCHOOL = "high school"
    UNIVERSITY_BACHELORS = "Bachelors"
    UNIVERSITY_MASTERS = "Masters"


class UserProfile(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    surname: str = Field(..., min_length=1, max_length=50)
    country_of_living: str = Field(..., min_length=2, max_length=50)
    level_of_studies: LevelOfStudies = Field(..., description="Level of studies the user is currently pursuing")
    current_gpa: float = Field(..., ge=0.0, le=4.0)

class User(BaseModel):
    login: UserLogin
    profile: UserProfile
    journey: Journey = Field(
        default_factory=Journey,
        description="The user's educational journey, including university and program details"
    )

__all__ = ["UserLogin", "LevelOfStudies", "UserProfile", "User"]