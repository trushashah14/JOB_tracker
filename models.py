from pydantic import BaseModel

class JobApplication(BaseModel):
    company: str
    role: str