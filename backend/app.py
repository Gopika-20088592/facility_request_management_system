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