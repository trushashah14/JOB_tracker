from tinydb import TinyDB, Query
from datetime import datetime

db = TinyDB("applications.json")
Job = Query()

def application_exists(company, role):
    return db.search((Job.company == company) & (Job.role == role))


def add_application(app_data):
    if application_exists(app_data["company"], app_data["role"]):
        return None  # Signals duplicate

    entry = {
        **app_data,
        "status": "Waiting",
        "date_applied": datetime.today().strftime("%Y-%m-%d"),
        "last_updated": datetime.today().strftime("%Y-%m-%d")
    }
    return db.insert(entry)

def get_all_applications():
    return db.all()