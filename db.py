from tinydb import TinyDB, Query
from datetime import datetime

db = TinyDB("applications.json")
Application = Query()

def add_application(company, role, status="Applied"):
    entry = {
        "company": company,
        "role": role,
        "date_applied": datetime.today().strftime("%Y-%m-%d"),
        "status": status,
        "last_updated": datetime.today().strftime("%Y-%m-%d")
    }
    db.insert(entry)

def get_all_applications():
    return db.all()