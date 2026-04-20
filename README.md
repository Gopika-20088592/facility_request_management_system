# Facility Request Management System

---

## Project Overview

The **Facility Request Management System** is a web-based application designed to manage and track facility-related requests within an organization.

The system allows users to create, view, search, filter, update, and manage requests efficiently. It replaces informal communication methods such as calls and messages with a structured and trackable system.

The application follows a full-stack approach, integrating frontend, backend, and database components. It is designed with a focus on simplicity, usability, and maintainability.

---

## 1. Problem Statement

In organizations, facility-related issues such as pantry items (tea, coffee, sugar, cups) running out were managed informally through calls or messages.

This led to:

* No proper tracking of requests
* Delays in resolving issues
* Lack of transparency
* No record of past requests

A centralized system was required to efficiently manage and track facility service requests.

---

## 2. Proposed Solution

To address this problem, a web-based **Facility Request Management System** was developed.

The system provides an interface where users can:

* Create new facility requests
* View all requests
* Search requests
* Filter requests by status
* Update request status
* Perform soft delete

---

## 3. System Requirements

### 3.1 Functional Requirements

* Add new facility requests
* View all requests
* Update request status
* Soft delete requests
* Search requests by keyword
* Filter requests based on status

---

## 4. CRUD Operations

### Facility Request Management

* **Create:** Add a new request
* **Read:** View all requests
* **Update:** Modify request status
* **Delete:** Soft delete (mark as Deleted instead of removing)

---

## 5. Additional Features

* Create a new facility request
* View all requests
* Search requests using keywords
* Filter requests by status:

  * New
  * In Progress
  * Resolved
  * Deleted

### Soft Delete Functionality

* Requests are not permanently removed from the database
* Instead, their status is updated to **"Deleted"**
* This ensures data is preserved and can be reviewed later

---

## 6. Non-Functional Requirements

### 6.1 Usability

* Simple and user-friendly interface
* Easy navigation
* Clear display of request data

### 6.2 Performance

* Fast API response
* Efficient data rendering

### 6.3 Reliability

* Data stored securely in SQLite
* No data loss due to soft delete

### 6.4 Maintainability

* Clear separation of frontend and backend
* Organized and modular code structure

---

## 7. Data Requirements and Storage

### 7.1 Entity: Facility Request

Each record contains:

* Request ID (Primary Key)
* Description
* Status
* Date

### 7.2 Database

* SQLite is used as the database
* Data is stored in a table called `requests`
* Each request is stored with a unique ID and status to allow tracking and updates

---

## 8. System Architecture

The system follows a client-server architecture:

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Flask (Python)
* **Database:** SQLite

The frontend communicates with the backend using **Fetch API to call REST APIs**.

This separation improves scalability, maintainability, and ensures clear data flow between components.

---

## 9. API Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | /requests             | Fetch all requests                    |
| POST   | /requests             | Create a new request                  |
| PUT    | /requests/<id>        | Update request details/status         |
| PUT    | /requests/delete/<id> | Soft delete (mark request as Deleted) |

---

## 10. System Workflow

1. User enters request details in the frontend
2. JavaScript collects input data
3. A request is sent to the backend using Fetch API
4. The backend processes the request
5. The backend interacts with the SQLite database
6. The database stores or retrieves data
7. The backend sends a response in JSON format
8. The frontend updates the user interface

---

## 11. Technologies Used

### Frontend

* HTML – structure of the application
* CSS – styling and layout
* JavaScript – user interaction and API communication

### Backend

* Python – backend development
* Flask – REST API development
* Flask-CORS – enables frontend-backend communication

### Database

* SQLite – data storage

### API

* REST API – communication using HTTP methods like GET, POST, and PUT

### Testing

* Python unittest – testing basic operations

---

## 12. Testing

The following operations were tested:

* Creating a request
* Retrieving requests
* Updating request status
* Soft deleting a request
* Full system workflow

Basic validation was also checked to ensure correct data handling.

To run tests:

cd backend
python test_app.py

---

## 13. Deployment

The application is deployed on AWS EC2 with NGINX.

Access URL:
http://34.224.215.71:5000

---

## 14. Project Structure

```id="v4p3yd"
FACILITY_REQUEST_MANAGEMENT/
│
├── backend/
│   ├── app.py                # Flask backend application
│   ├── facility_requests.db # SQLite database
│   ├── test_app.py          # Unit testing file
│   └── .gitignore
│
├── frontend/
│   ├── css_styling/
│   │   ├── create_request.css
│   │   ├── index.css
│   │   ├── main.css
│   │   └── view_request.css
│   │
│   ├── javascript/
│   │   ├── create_request.js
│   │   └── view_request.js
│   │
│   ├── create_request.html
│   ├── index.html
│   └── view_request.html
│
└── README.md
```

## 15. Use of AI and External Resources

### AI Usage

AI tools such as ChatGPT & Claude.ai were used to:

* Understand concepts like REST APIs and Flask
* Assist in structuring code
* Debug errors and improve implementation
* Guide the development process

**Links**
1. https://chatgpt.com/share/69e21cf5-f0f0-838b-96f4-b16aedb62c04
2. https://claude.ai/share/857287e6-263a-4b4f-9bdd-35ca59bfe8af
3. https://chatgpt.com/share/69e21c9f-3ad0-8330-b075-cee00e9a7d60

All outputs were tested and verified.

### External Resources

* W3Schools – HTML, CSS, JavaScript concepts
* Flask Documentation – backend and API development
* SQLite Documentation – database handling

---
## 16. Future Enhancements

* User authentication system
* Admin dashboard
* Advanced filtering options
* Improved UI/UX

## 17. Conclusion

This project demonstrates a complete full-stack application integrating frontend, backend, and database components.

It provides a simple and effective solution for managing facility requests, improving tracking, transparency, and efficiency compared to manual methods.

---
