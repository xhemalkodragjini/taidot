from fastapi import FastAPI
from api.routes.user import router as user_router
from api.routes.journey import router as journey_router

app = FastAPI()

app.include_router(user_router)
app.include_router(journey_router)
