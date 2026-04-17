import requests
import time

URL = "http://localhost:5000/api/submit_claim"

def run_test(name, payload):
    print(f"\n--- Testing: {name} ---")
    response = requests.post(URL, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

test_cases = [
    {
        "name": "1. Approved Claim (Good data)",
        "payload": {
            "worker_id": "WK-001",
            "claim_event_id": "FLOOD_001",
            "device_fingerprint_hash": "dev_hash_good",
            "gyroscope_variance": 0.05,
            "html5_lat": 13.0827,
            "html5_lng": 80.2707,
            "html5_accuracy_meters": 50
        }
    },
    {
        "name": "2. Emulator Detected [ERR_01] (gyroscope_variance = 0)",
        "payload": {
            "worker_id": "WK-002",
            "claim_event_id": "FLOOD_002",
            "device_fingerprint_hash": "dev_hash_emu",
            "gyroscope_variance": 0.0,
            "html5_lat": 13.0827,
            "html5_lng": 80.2707,
            "html5_accuracy_meters": 50
        }
    },
    {
        "name": "3. Location Unverified [ERR_04] (Inaccurate GPS)",
        "payload": {
            "worker_id": "WK-003",
            "claim_event_id": "FLOOD_003",
            "device_fingerprint_hash": "dev_hash_gps",
            "gyroscope_variance": 0.02,
            "html5_lat": 13.0827,
            "html5_lng": 80.2707,
            "html5_accuracy_meters": 2000
        }
    },
    {
        "name": "4. Device Farm Detected [ERR_03] (Submitting same device multiple times)",
        "payload": {
            "worker_id": "WK-004",
            "claim_event_id": "FLOOD_004",
            "device_fingerprint_hash": "dev_hash_farm",
            "gyroscope_variance": 0.02,
            "html5_lat": 13.0827,
            "html5_lng": 80.2707,
            "html5_accuracy_meters": 50
        }
    }
]

if __name__ == "__main__":
    for i, tc in enumerate(test_cases):
        run_test(tc["name"], tc["payload"])
        if tc["name"].startswith("4. Device Farm"):
            print("\n   -> Submitting 2nd and 3rd time to trigger Device Farm rule...")
            time.sleep(1)
            requests.post(URL, json=tc["payload"])
            requests.post(URL, json=tc["payload"])
            run_test("   -> 4th Submission", tc["payload"])
