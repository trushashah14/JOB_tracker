from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session, select
from datetime import datetime
from passlib.context import CryptContext




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    email: str
    hashed_password: str  # 👈 Store the hashed password only

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self.hashed_password)

    def set_password(self, plain_password: str):
        self.hashed_password = pwd_context.hash(plain_password)



class JobApplication(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int  # 👈 Link to User

    company: str
    role: str
    status: str = "Waiting"
    date_applied: str = datetime.today().strftime("%Y-%m-%d")
    last_updated: str = datetime.today().strftime("%Y-%m-%d")
    ghosted_date: Optional[str] = None

engine = create_engine("sqlite:///applications.db")


def add_application(app_data):
    with Session(engine) as session:
        existing = session.exec(
            select(JobApplication).where(
                JobApplication.company == app_data["company"],
                JobApplication.role == app_data["role"]
            )
        ).first()
        if existing:
            return None
        app = JobApplication(**app_data)
        session.add(app)
        session.commit()
        return app.id

def get_applications_by_user(user_id: int):
    with Session(engine) as session:
        return session.exec(select(JobApplication).where(JobApplication.user_id == user_id)).all()