from tinydb import TinyDB
from datetime import datetime

db = TinyDB("applications.json")

def add_application(app_data):
    entry = {
        **app_data,
        "status": "Waiting",
        "date_applied": datetime.today().strftime("%Y-%m-%d"),
        "last_updated": datetime.today().strftime("%Y-%m-%d")
    }
    return db.insert(entry)

def get_all_applications():
    return db.all()