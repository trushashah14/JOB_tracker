from fastapi import FastAPI, HTTPException
from models import JobApplication
from sqlmodel import SQLModel

from db import add_application, get_all_applications , engine
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://job-tracker-ebon-gamma.vercel.app/"
],  # 👈 your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on app startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/applications")
def create_application(app: JobApplication):
    app_id = add_application(app.dict())
    if app_id is None:
        raise HTTPException(
            status_code=400,
            detail=f"You've already applied for '{app.role}' at '{app.company}'."
        )

    return {"id": app_id, "message": "Application added with status 'Waiting'."}

@app.get("/applications")
def list_applications():
    return get_all_applications()