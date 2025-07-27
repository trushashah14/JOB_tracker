from datetime import datetime

def days_since(date_str):
    date_applied = datetime.strptime(date_str, "%Y-%m-%d")
    return (datetime.today() - date_applied).days