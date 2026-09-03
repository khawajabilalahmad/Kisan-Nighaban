import requests
import json

url = "http://localhost:8000/api/auth/register"
payload = {
    "full_name": "Test User",
    "email": "test99@example.com",
    "mobile_number": "1234567890",
    "password": "password123"
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
