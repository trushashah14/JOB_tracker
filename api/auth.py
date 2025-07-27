from sqlmodel import Session, select
from db import engine, User  # import your SQLModel User table from db.py
from models import UserCreate, UserLogin  # Pydantic models used in request bodies
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(user_data: UserCreate):
    with Session(engine) as session:
        existing_email = session.exec(select(User).where(User.email == user_data.email)).first()
        existing_username = session.exec(select(User).where(User.username == user_data.username)).first()
        if existing_email or existing_username:
            return None

        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=pwd_context.hash(user_data.password)
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


def login_user(login_data: UserLogin):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == login_data.username)).first()
        if not user:
            return None
        valid = pwd_context.verify(login_data.password, user.hashed_password)
        return user if valid else None
