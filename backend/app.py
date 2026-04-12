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


def init_db():
    connection = get_db_connection()
    connection.execute("""
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT,
            employee_name TEXT,
            employee_id TEXT,
            floor TEXT,
            pantry TEXT,
            issue_type TEXT,
            description TEXT,
            submitted_at TEXT,
            status TEXT,
            comment TEXT,
            assigned_to TEXT,
            delete_reason TEXT
        )
    """)
    connection.commit()
    connection.close()


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


@app.route("/requests", methods=["POST"])
def create_request():
    data = request.get_json()

    generated_request_id = generate_request_id()
    submitted_at = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO requests (
            request_id,
            employee_name,
            employee_id,
            floor,
            pantry,
            issue_type,
            description,
            submitted_at,
            status,
            comment,
            assigned_to,
            delete_reason
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        generated_request_id,
        data.get("employeeName"),
        data.get("employeeId"),
        data.get("floor"),
        data.get("pantry"),
        data.get("issueType"),
        data.get("description"),
        submitted_at,
        "New",
        "",
        "",
        ""
    ))

    connection.commit()
    new_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Request created successfully",
        "requestId": generated_request_id,
        "id": new_id
    }), 201


@app.route("/requests/<int:request_id>", methods=["PUT"])
def update_request(request_id):
    data = request.get_json()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE requests
        SET
            employee_name = ?,
            employee_id = ?,
            floor = ?,
            pantry = ?,
            issue_type = ?,
            description = ?,
            status = ?,
            comment = ?,
            assigned_to = ?,
            delete_reason = ?
        WHERE id = ?
    """, (
        data.get("employeeName"),
        data.get("employeeId"),
        data.get("floor"),
        data.get("pantry"),
        data.get("issueType"),
        data.get("description"),
        data.get("status"),
        data.get("comment"),
        data.get("assignedTo"),
        data.get("deleteReason"),
        request_id
    ))

    connection.commit()
    connection.close()

    return jsonify({"message": "Request updated successfully"}), 200

if __name__ == "__main__":
    init_db()
    app.run(host='0.0.0.0', port=5000,debug=True)
