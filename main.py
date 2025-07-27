from fastapi import FastAPI
from models import JobApplication
from db import add_application, get_all_applications

app = FastAPI()

@app.post("/applications")
def create_application(app: JobApplication):
    app_id = add_application(app.dict())
    return {"id": app_id, "message": "Application added with status 'Waiting'."}

@app.get("/applications")
def list_applications():
    return get_all_applications()