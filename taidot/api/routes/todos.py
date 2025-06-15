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
    date: str  # planned start date
    title: str
    programs: List[str]
    description: str
    due_dates: List[str]

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
        f"You are an expert academic planner. Given the following university programs, their admission requirements, and deadlines, "
        f"create a step-by-step, date-based plan for the user to complete all requirements for all programs, starting from today ({now}) and ending at the respective deadlines. "
        f"For each todo, return the following fields: 'date' (the planned start date for the task), 'title' (the task), 'programs' (a list of program names this task applies to), 'description' (details), and 'due_dates' (a list of due dates for the relevant programs). The 'date' should be the date the user should start the task, not the deadline. "
        f"If a requirement (like an application letter or IELTS) is needed for multiple programs, schedule the work in parallel or in logical sequence, and specify for which program/university each task is. "
        f"If a document (such as a bachelor's degree or transcript of records) is required for multiple programs, plan a single task for gathering/preparing that document for all programs at once, not separately for each university. "
        f"For document-related requirements, analyze and include steps for preparation: check if translation is needed, if a certified copy is required, and any other necessary preparation steps. "
        f"Distribute the workload realistically, grouping similar tasks when possible, and ensure no deadlines are missed. "
        f"Return only a valid JSON array, using double quotes for all keys and string values. If you need to use quotes inside a string value, use single quotes. Do not include any extra text or formatting. Limit the plan to a maximum of 20 items. "
        f"Programs and requirements: {requirements}\n"
        f"JSON Format: [{{\"date\": str, \"title\": str, \"programs\": [str], \"description\": str, \"due_dates\": [str]}}]"
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
        # Fix single quotes to double quotes, remove trailing commas, and fix unescaped inner quotes
        todos_json = re.sub(r"'", '"', todos_json)
        todos_json = re.sub(r",\s*]", "]", todos_json)
        todos_json = re.sub(r",\s*}", "}", todos_json)
        # Replace unescaped inner double quotes with single quotes inside string values
        todos_json = re.sub(r'(?<=: )"([^"]*?)"([^"]*?)(?=",|"})', lambda m: m.group(0).replace('"', "'"), todos_json)
        # Replace single-quoted string values with double quotes (robust, even if value contains double quotes or apostrophes)
        todos_json = re.sub(r':\s*\'(.*?)\'([,}\]])', lambda m: ': "' + m.group(1).replace('"', '\"') + '"' + m.group(2), todos_json)
        # Fix mixed single/double quotes at the start of string values (e.g., "title": 'value")
        todos_json = re.sub(r'("[^"]+":)\s*\'(.*?)"', lambda m: m.group(1) + ' "' + m.group(2).replace('"', '\"') + '"', todos_json)
        # Fix truncated JSON arrays
        if todos_json.count('{') > todos_json.count('}'):
            # Truncate at last complete object
            last_brace = todos_json.rfind('}')
            if last_brace != -1:
                todos_json = todos_json[:last_brace+1] + "]"
        # Replace curly quotes with straight quotes
        todos_json = todos_json.replace("’", "'").replace("‘", "'")
        todos_json = todos_json.replace("“", '"').replace("”", '"')
        todos = json.loads(todos_json)
    except Exception as e:
        print(f"Error parsing GPT output: {e}\nRaw output: {todos_json}")
        todos = []
    # Save todos to user profile
    db_user.profile["todos"] = todos
    db.commit()
    return todos
