from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.user import router as user_router
from api.routes.journey import router as journey_router

app = FastAPI()

# Allow all origins for development; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(journey_router)
