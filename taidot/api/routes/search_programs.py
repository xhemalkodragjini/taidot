from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import os
import openai
import httpx

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

class ProgramSearchRequest(BaseModel):
    university: str
    degree: str
    program: str

class ProgramSearchResponse(BaseModel):
    programs: List[str]

@router.post("/search_programs", response_model=ProgramSearchResponse)
async def search_programs(req: ProgramSearchRequest):
    openai.api_key = OPENAI_API_KEY
    prompt = (
        f"Generate a concise Google search query to find {req.degree} programs in {req.program} at {req.university}. Return only the query."
    )
    ai_response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=32,
        temperature=0.2
    )
    search_query = ai_response.choices[0].text.strip()

    # Use SerpAPI to search Google
    params = {
        "q": search_query,
        "api_key": SERPAPI_KEY,
        "num": 5,
        "engine": "google",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://serpapi.com/search", params=params)
        data = resp.json()
        programs = []
        for item in data.get("organic_results", []):
            title = item.get("title")
            if title:
                programs.append(title)
    if not programs:
        programs = [f"No programs found for {req.university} {req.degree} {req.program}"]
    return {"programs": programs}
