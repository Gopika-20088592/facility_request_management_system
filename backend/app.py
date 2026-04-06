from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection = sqlite3.connect("facility_requests.db")
    connection.row_factory = sqlite3.Row
    return connection

    def generate_request_id():
    connection = get_db_connection()
    cursor = connection.cursor()

    current_year = datetime.now().year
    prefix = f"REQ-{current_year}-"

    cursor.execute("""
        SELECT request_id
        FROM requests
        WHERE request_id LIKE ?
        ORDER BY id DESC
        LIMIT 1
    """, (f"{prefix}%",))

    last_request = cursor.fetchone()
    connection.close()

    if last_request:
        last_number = int(last_request["request_id"].split("-")[-1])
        new_number = last_number + 1
    else:
        new_number = 1

    return f"REQ-{current_year}-{str(new_number).zfill(3)}"