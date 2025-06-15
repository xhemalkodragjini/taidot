from fastapi import APIRouter
from pydantic import BaseModel
import os
from openai import OpenAI
import httpx
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

class ResourceSearchRequest(BaseModel):
    topic: str  # e.g. 'cv', 'ielts', 'motivation letter'

class ResourceLink(BaseModel):
    title: str
    link: str
    snippet: str = ""

class ResourceSearchResponse(BaseModel):
    links: list[ResourceLink]

@router.post("/search_resources", response_model=ResourceSearchResponse)
async def search_resources(req: ResourceSearchRequest):
    # Custom prompt for English language learning resources
    if req.topic.lower() in ["english language test", "english", "ielts", "toefl"]:
        prompt = (
            f"You are an expert university application assistant. "
            f"Create a concise Google search query to find the best, most up-to-date free online resources, courses, and practice materials for students to learn English and prepare for English language exams (IELTS, TOEFL, etc.) in 2025. "
            f"Focus on preparation, learning, and practice, not requirements. Return only the query string."
        )
    else:
        prompt = (
            f"You are an expert university application assistant. "
            f"Create a concise Google search query to find the best, most up-to-date guides and resources for '{req.topic}' for university applications in 2025. "
            f"Return only the query string."
        )
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=32,
    )
    search_query = response.choices[0].message.content.strip()
    params = {
        "q": search_query,
        "api_key": SERPAPI_KEY,
        "num": 5,
        "engine": "google",
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as client_httpx:  # 20 seconds timeout
            resp = await client_httpx.get("https://serpapi.com/search", params=params)
            data = resp.json()
    except httpx.ReadTimeout:
        return {"links": []}  # Or return a message indicating timeout
    links = []
    for item in data.get("organic_results", []):
        links.append(ResourceLink(
            title=item.get("title", ""),
            link=item.get("link", ""),
            snippet=item.get("snippet", "")
        ))
    return {"links": links}
