from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Union
import os
from openai import OpenAI
import httpx
from dotenv import load_dotenv
from database.schema import Journey
import json
import re

load_dotenv()

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

class ProgramSearchRequest(BaseModel):
    university: str
    degree: str
    program: str

class ProgramSearchResponse(BaseModel):
    programs: List[Journey]

@router.post("/search_programs", response_model=ProgramSearchResponse)
async def search_programs(req: ProgramSearchRequest):
    prompt = (
        f"You are a university program search assistant. "
        f"Create a concise and effective Google search query to find the official {req.degree} program page "
        f"(not short courses, not certificates, not scholarships) for {req.program} at {req.university}. "
        f"Return only the exact query string. Prioritize official university domains."
    )
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=32,
    )
    search_query = response.choices[0].message.content.strip()

    # Use SerpAPI to search Google
    params = {
        "q": search_query,
        "api_key": SERPAPI_KEY,
        "num": 10,
        "engine": "google",
    }
    async with httpx.AsyncClient() as client_httpx:
        resp = await client_httpx.get("https://serpapi.com/search", params=params)
        data = resp.json()

    search_results = [item.get("title", "") + " - " + item.get("link", "")
                      for item in data.get("organic_results", []) if item.get("title")]

    if not search_results:
        return {"programs": []}

    summary_prompt = (
        f"You are an expert in academic programs. Given the following list of search results, extract only the official university degree programs that have ALL of the following fields with non-empty values: university name, country, program title, program level ('BSc'|'MSc'|'PhD'), admission_requirements (list), application_procedure (string), and deadline (string).\n"
        f"If any of these fields is missing or is an empty string or empty list, do not include that program in the output.\n"
        f"For each valid program, return a JSON array of Journey objects with fields: university (name, country), and program (title, level, requirements).\n"
        f"requirements must be a dict with: 'admission_requirements' (list of requirements), 'application_procedure' (where to apply, including the official application link if available), and 'deadline' (application deadline, if available).\n"
        f"The 'application_procedure' field should only contain the official application website or portal, and a direct link if possible. Do not include instructions or steps, just the location/link.\n"
        f"Ignore duplicates, certificates, fellowships, or non-degree offerings.\n"
        f"If no programs meet all criteria, return an empty JSON array.\n\n"
        f"Search Results: {search_results}\n\n"
        f"JSON Format: [{{'university': {{'name': str, 'country': str}}, 'program': {{'title': str, 'level': 'BSc'|'MSc'|'PhD', 'requirements': {{'admission_requirements': list, 'application_procedure': str, 'deadline': str}}}}}}]"
    )

    summary_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": summary_prompt}],
        temperature=0.2,
        max_tokens=800,
    )


    try:
        summary_json = summary_response.choices[0].message.content.strip()
        # Remove triple backticks and optional 'json' prefix
        summary_json = re.sub(r"^```json|^```|```$", "", summary_json, flags=re.IGNORECASE).strip()
        journeys = json.loads(summary_json)
        journeys = [Journey(**j) for j in journeys]
    except Exception as e:
        print(f"Error parsing GPT output: {e}")
        journeys = []
    return {"programs": journeys}
