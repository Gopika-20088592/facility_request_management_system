import unittest
import json
from app import app


class TestFacilityRequestApp(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True
        
    def test_01_create_request(self):
        data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP001",
            "floor": "Floor 1",
            "pantry": "Pantry A",
            "issueType": "Tea/Coffee Refill",
            "description": "Need tea refill"
        }
        response = self.client.post(
            "/requests",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 201)
        result = json.loads(response.data)
        self.assertIn("requestId", result)

    def test_02_read_all_requests(self):
        response = self.client.get("/requests")
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertIsInstance(result, list)

    def test_03_read_single_request(self):
        data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP002",
            "floor": "Floor 2",
            "pantry": "Pantry B",
            "issueType": "Milk Refill",
            "description": "Need milk refill"
        }
        post_response = self.client.post(
            "/requests",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        request_id = json.loads(post_response.data).get("id")

        # then read it
        response = self.client.get(f"/requests/{request_id}")
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result["employeeName"], "Test Employee")

    def test_04_update_request(self):
        data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP003",
            "floor": "Floor 3",
            "pantry": "Pantry C",
            "issueType": "Cup Shortage",
            "description": "Need more cups"
        }
        post_response = self.client.post(
            "/requests",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        request_id = json.loads(post_response.data).get("id")

        updated_data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP003",
            "floor": "Floor 3",
            "pantry": "Pantry C",
            "issueType": "Cup Shortage",
            "description": "Need more cups",
            "status": "In Progress",
            "comment": "Working on it",
            "assignedTo": "John",
            "deleteReason": ""
        }
        response = self.client.put(
            f"/requests/{request_id}",
            json=updated_data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertEqual(result["message"], "Request updated successfully")

if __name__ == "__main__":
    unittest.main(verbosity=2)

