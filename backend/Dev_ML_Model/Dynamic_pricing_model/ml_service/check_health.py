import requests
import json

try:
    response = requests.get("http://localhost:8000/health")
    print("=== System Health Status ===")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: Could not connect to the ML service. (Is it running on port 8000?)")
