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

    def test_05_delete_request(self):
        data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP004",
            "floor": "Floor 1",
            "pantry": "Pantry A",
            "issueType": "Cleaning Required",
            "description": "Needs cleaning"
        }
        post_response = self.client.post(
            "/requests",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        request_id = json.loads(post_response.data).get("id")

        delete_data = {
            "employeeName": "Test Employee",
            "employeeId": "EMP004",
            "floor": "Floor 1",
            "pantry": "Pantry A",
            "issueType": "Cleaning Required",
            "description": "Needs cleaning",
            "status": "Deleted",
            "comment": "",
            "assignedTo": "",
            "deleteReason": "Request raised by mistake"
        }
        response = self.client.put(
            f"/requests/{request_id}",
            json=delete_data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)

        get_response = self.client.get(f"/requests/{request_id}")
        result = json.loads(get_response.data)
        self.assertEqual(result["status"], "Deleted")


    def test_06_integration_create_read_update(self):

        data = {
            "employeeName": "Integration Test",
            "employeeId": "EMP999",
            "floor": "Floor 2",
            "pantry": "Pantry B",
            "issueType": "Sugar Refill",
            "description": "Sugar finished"
        }
        post_response = self.client.post(
            "/requests",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(post_response.status_code, 201)
        request_id = json.loads(post_response.data).get("id")
        request_id_text = json.loads(post_response.data).get("requestId")
        print(f"\nIntegration Test - Created Request ID: {request_id_text}")

        get_response = self.client.get("/requests")
        self.assertEqual(get_response.status_code, 200)
        all_requests = json.loads(get_response.data)
        ids = [r["id"] for r in all_requests]
        self.assertIn(request_id, ids)
        print(f"Integration Test - Request found on dashboard")

        updated_data = {
            "employeeName": "Integration Test",
            "employeeId": "EMP999",
            "floor": "Floor 2",
            "pantry": "Pantry B",
            "issueType": "Sugar Refill",
            "description": "Sugar finished",
            "status": "Resolved",
            "comment": "Sugar refilled",
            "assignedTo": "Facility Team",
            "deleteReason": ""
        }
        put_response = self.client.put(
            f"/requests/{request_id}",
            json=updated_data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(put_response.status_code, 200)
        print(f"Integration Test - Request updated to Resolved")

        verify_response = self.client.get(f"/requests/{request_id}")
        result = json.loads(verify_response.data)
        self.assertEqual(result["status"], "Resolved")
        self.assertEqual(result["assignedTo"], "Facility Team")
        print(f"Integration Test - Status verified as Resolved")

        delete_data = {
            "employeeName": "Integration Test",
            "employeeId": "EMP999",
            "floor": "Floor 2",
            "pantry": "Pantry B",
            "issueType": "Sugar Refill",
            "description": "Sugar finished",
            "status": "Deleted",
            "comment": "Sugar refilled",
            "assignedTo": "Facility Team",
            "deleteReason": "Request completed and closed"
        }
        delete_response = self.client.put(
            f"/requests/{request_id}",
            json=delete_data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(delete_response.status_code, 200)
        print(f"Integration Test - Request deleted successfully")

        verify_delete = self.client.get(f"/requests/{request_id}")
        final_result = json.loads(verify_delete.data)
        self.assertEqual(final_result["status"], "Deleted")
        self.assertEqual(final_result["deleteReason"], "Request completed and closed")
        print(f"Integration Test - Status verified as Deleted")

if __name__ == "__main__":
    unittest.main(verbosity=2)