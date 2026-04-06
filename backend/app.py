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

    @app.route("/")
def home():
    return "Facility Request Backend is running."


@app.route("/requests", methods=["GET"])
def get_requests():
    connection = get_db_connection()
    requests = connection.execute("SELECT * FROM requests").fetchall()
    connection.close()

    request_list = []

    for request_item in requests:
        request_list.append({
            "id": request_item["id"],
            "requestId": request_item["request_id"],
            "employeeName": request_item["employee_name"],
            "employeeId": request_item["employee_id"],
            "floor": request_item["floor"],
            "pantry": request_item["pantry"],
            "issueType": request_item["issue_type"],
            "description": request_item["description"],
            "submittedAt": request_item["submitted_at"],
            "status": request_item["status"],
            "comment": request_item["comment"],
            "assignedTo": request_item["assigned_to"],
            "deleteReason": request_item["delete_reason"]
        })

    return jsonify(request_list)
    
    @app.route("/requests/<int:request_id>", methods=["GET"])
def get_request_by_id(request_id):
    connection = get_db_connection()
    request_item = connection.execute(
        "SELECT * FROM requests WHERE id = ?",
        (request_id,)
    ).fetchone()
    connection.close()

    if request_item is None:
        return jsonify({"message": "Request not found"}), 404

    request_data = {
        "id": request_item["id"],
        "requestId": request_item["request_id"],
        "employeeName": request_item["employee_name"],
        "employeeId": request_item["employee_id"],
        "floor": request_item["floor"],
        "pantry": request_item["pantry"],
        "issueType": request_item["issue_type"],
        "description": request_item["description"],
        "submittedAt": request_item["submitted_at"],
        "status": request_item["status"],
        "comment": request_item["comment"],
        "assignedTo": request_item["assigned_to"],
        "deleteReason": request_item["delete_reason"]
    }

    return jsonify(request_data)