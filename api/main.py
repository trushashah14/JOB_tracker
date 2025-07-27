from fastapi import FastAPI, HTTPException
from models import JobApplicationCreate
from sqlmodel import SQLModel,Session,select 
from models import UserCreate, UserLogin ,  PasswordReset # Pydantic request models
from auth import register_user, login_user
from db import add_application, get_applications_by_user , engine ,pwd_context,JobApplication , User

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://job-tracker-ebon-gamma.vercel.app"
],  # 👈 your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on app startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/reset-password")
def reset_password(data: PasswordReset):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        user.hashed_password = pwd_context.hash(data.new_password)
        session.add(user)
        session.commit()
        
        return {"message": "Password reset successful!"}

@app.post("/register")
def register(user_data: UserCreate):
    user = register_user(user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email or username already registered.")
    return {
        "message": "Registered!",
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }

@app.post("/login")
def login(login_data: UserLogin):
    user = login_user(login_data)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    return {
        "message": "Logged in!",
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }   

@app.post("/applications")
def create_application(app: JobApplicationCreate, user_id: int):
    app_data = app.dict()
    app_data["user_id"] = user_id 

    app_id = add_application(app_data)
    if app_id is None:
        raise HTTPException(
            status_code=400,
            detail=f"You've already applied for '{app.role}' at '{app.company}'."
        )

    return {"id": app_id, "message": "Application added with status 'Waiting'."}

@app.get("/applications")
def list_applications(user_id: int):
    return get_applications_by_user(user_id)

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    with Session(engine) as session:
        app = session.get(JobApplication, app_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found.")
        session.delete(app)
        session.commit()
        return {"message": f"Application {app_id} deleted."}
