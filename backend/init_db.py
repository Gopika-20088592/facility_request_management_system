import sqlite3

connection = sqlite3.connect("facility_requests.db")
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    floor TEXT NOT NULL,
    pantry TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL,
    comment TEXT,
    assigned_to TEXT,
    delete_reason TEXT
)
""")