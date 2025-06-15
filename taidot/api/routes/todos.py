from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from database.models import SessionLocal, User as DBUser, Journey as DBJourney
from sqlalchemy.orm import Session
import os
from openai import OpenAI
from datetime import datetime, timedelta

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

class Todo(BaseModel):
    title: str
    description: str
    due_date: str

@router.get("/user/{username}/todos", response_model=List[Todo])
def get_todos(username: str, db: Session = Depends(lambda: SessionLocal())):
    db_user = db.query(DBUser).filter(DBUser.username == username).first()
    if not db_user or not hasattr(db_user, "profile") or not db_user.profile.get("todos"):
        return []
    return db_user.profile["todos"]

@router.post("/user/{username}/todos/plan", response_model=List[Todo])
def plan_todos(username: str, db: Session = Depends(lambda: SessionLocal())):
    db_user = db.query(DBUser).filter(DBUser.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    journeys = db_user.journeys
    if not journeys:
        raise HTTPException(status_code=404, detail="No journeys found for user")
    # Collect all admission requirements and deadlines
    requirements = []
    for j in journeys:
        program = j.program
        reqs = program.get("requirements", {})
        for step in reqs.get("admission_requirements", []):
            requirements.append({
                "program": program.get("title", ""),
                "step": step,
                "deadline": reqs.get("deadline", "")
            })
    # Use OpenAI to generate a plan
    now = datetime.now().strftime("%Y-%m-%d")
    prompt = (
        f"You are an expert academic planner. Given the following admission requirements and deadlines, "
        f"create a step-by-step plan for the user to complete each requirement, starting from today ({now}) and ending at the respective deadline. "
        f"Return a JSON array of todos with fields: title, description, due_date (YYYY-MM-DD).\n"
        f"Requirements: {requirements}\n"
        f"JSON Format: [{{'title': str, 'description': str, 'due_date': str}}]"
    )
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=800,
    )
    import json, re
    try:
        todos_json = response.choices[0].message.content.strip()
        todos_json = re.sub(r"^```json|^```|```$", "", todos_json, flags=re.IGNORECASE).strip()
        todos = json.loads(todos_json)
    except Exception as e:
        print(f"Error parsing GPT output: {e}")
        todos = []
    # Save todos to user profile
    db_user.profile["todos"] = todos
    db.commit()
    return todos
