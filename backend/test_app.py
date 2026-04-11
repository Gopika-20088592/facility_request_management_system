import unittest
import json
from app import app


class TestFacilityRequestApp(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True


if __name__ == "__main__":
    unittest.main(verbosity=2)