from sqlmodel import SQLModel, Field, create_engine, Session, select
from datetime import datetime

class JobApplication(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    company: str
    role: str
    status: str = "Waiting"
    date_applied: str = datetime.today().strftime("%Y-%m-%d")
    last_updated: str = datetime.today().strftime("%Y-%m-%d")

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

def get_all_applications():
    with Session(engine) as session:
        return session.exec(select(JobApplication)).all()