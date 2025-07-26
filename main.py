from db import add_application, get_all_applications
from utils import days_since
from rich.table import Table
from rich.console import Console

console = Console()

def show_applications():
    apps = get_all_applications()
    table = Table(title="📋 Job Applications")

    table.add_column("Company")
    table.add_column("Role")
    table.add_column("Applied", justify="right")
    table.add_column("Days Ago", justify="center")
    table.add_column("Status", style="cyan")

    for app in apps:
        days = str(days_since(app["date_applied"]))
        table.add_row(
            app["company"],
            app["role"],
            app["date_applied"],
            days,
            app["status"]
        )

    console.print(table)

def add_new_application():
    company = input("Company name: ")
    role = input("Role title: ")
    status = input("Status [default: Applied]: ") or "Applied"
    add_application(company, role, status)
    print("✅ Application added.")

# Simple Menu
while True:
    print("\n1. Add new application\n2. View all applications\n3. Exit")
    choice = input("Choose an option: ")

    if choice == "1":
        add_new_application()
    elif choice == "2":
        show_applications()
    elif choice == "3":
        break
    else:
        print("Invalid choice.")