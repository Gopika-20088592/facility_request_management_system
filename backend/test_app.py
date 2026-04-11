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

if __name__ == "__main__":
    unittest.main(verbosity=2)

