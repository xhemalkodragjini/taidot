from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database.schema import Journey as JourneySchema
from database.models import SessionLocal, User as DBUser, Journey as DBJourney
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/user/{username}/journeys", response_model=List[JourneySchema])
def get_user_journeys(username: str, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Return journeys with id included
    return [
        JourneySchema(
            id=j.id,
            university=j.university,
            program=j.program
        ) for j in db_user.journeys
    ]

@router.get("/user/{username}/journey", response_model=JourneySchema)
def get_user_journey(username: str, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.username == username).first()
    if not db_user or not db_user.journeys:
        raise HTTPException(status_code=404, detail="User or journey not found")
    return db_user.journeys[0]

@router.post("/user/{username}/journeys", response_model=JourneySchema)
def add_journey_for_user(username: str, journey: JourneySchema, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_journey = DBJourney(user_id=db_user.id, university=journey.university.dict(), program=journey.program.dict())
    db.add(db_journey)
    db.commit()
    db.refresh(db_journey)
    return JourneySchema(
        id=db_journey.id,
        university=db_journey.university,
        program=db_journey.program
    )
