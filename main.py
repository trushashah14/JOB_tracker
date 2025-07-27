from fastapi import FastAPI, HTTPException
from models import JobApplication
from db import add_application, get_all_applications
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 👈 your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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