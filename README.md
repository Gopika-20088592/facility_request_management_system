# facility_request_management_system

## Project Overview

This project is based on the **Design and Development of a Facility Service Request Management System for NTT Data Organisation**.

The idea for this system comes from real-world experience. While working in the organization, several issues were observed related to pantry and facility services. Common problems included items like tea, coffee, sugar, or cups running out, and employees had to inform the facility team through calls or messages.

Since this communication was informal, there was:

* No proper tracking system
* Delays in resolving issues
* Lack of transparency

To solve this, the project aims to develop a **simple web-based system** where:

* Employees can raise facility or pantry-related requests
* Requests can be tracked efficiently
* Facility teams can manage and update request statuses

The system helps improve:

* Communication
* Tracking
* Transparency
* Efficiency in handling facility service requests

---

## Live Deployment

The application is deployed on AWS EC2 and configured using NGINX.

**Live URL:**
http://34.224.215.71:5000

---

## Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python (Flask)

### Database

* SQLite (`facility_requests.db`)

### Deployment

* AWS EC2 (Ubuntu)
* NGINX (for serving frontend)

---

## Project Structure

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
---

## Core Features

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

## System Workflow

1. User submits a request through the frontend
2. JavaScript sends data using Fetch API
3. Flask backend processes the request
4. Data is stored in SQLite database
5. Backend returns response in JSON format
6. Frontend displays updated request list
7. Search and filter are applied using JavaScript

---

## API Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | /requests             | Fetch all requests                    |
| POST   | /requests             | Create a new request                  |
| PUT    | /requests/<id>        | Update request details/status         |
| PUT    | /requests/delete/<id> | Soft delete (mark request as Deleted) |

---

## Key Concepts Used

### Frontend

* DOM Manipulation
* Fetch API
* JavaScript array methods:

  * `filter()`
  * `forEach()`

### Backend

* Flask routing
* REST API development
* JSON handling

### Database

* SQLite for storing request data

---

## Testing

Unit testing is implemented using Python `unittest`:

backend/test_app.py

Tests include:

* Creating a request
* Fetching all requests

---

## Deployment (AWS EC2 + NGINX)
Steps Followed:
* EC2 Ubuntu instance created
* Backend Flask app deployed
* Port 5000 opened in security group
* NGINX configured as reverse proxy
* Frontend served via NGINX
* GitHub repository cloned into server

## Improvements Made

* Simplified code for better readability
* Focused on essential features
* Improved search and filter logic
* Organized project into frontend and backend

---

## Future Enhancements

* User authentication system
* Admin dashboard
* Advanced filtering options
* Improved UI/UX

---
