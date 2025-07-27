from pydantic import BaseModel

class JobApplicationCreate(BaseModel):
    company: str
    role: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class PasswordReset(BaseModel):
    email: str
    new_password: str
