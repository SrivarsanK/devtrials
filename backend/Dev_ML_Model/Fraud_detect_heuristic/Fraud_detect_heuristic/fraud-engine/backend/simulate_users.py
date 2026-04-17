import requests
import random
import time

API_URL = "http://127.0.0.1:5000/api/submit_claim"

# My fetched location (Chennai base)
MY_LAT = 13.0895
MY_LON = 80.2739

def simulate_user(worker_id, label, scenario="legit"):
    print(f"\n--- Simulating User: {worker_id} ({label}) ---")
    
    payload = {
        "worker_id": worker_id,
        "claim_event_id": "Sholinganallur", # One of the updated zones
        "device_fingerprint_hash": f"fingerprint_{worker_id}_{random.randint(1000, 9999)}",
        "gyroscope_variance": random.uniform(0.01, 0.1),
        "html5_lat": MY_LAT + random.uniform(-0.01, 0.01),
        "html5_lng": MY_LON + random.uniform(-0.01, 0.01),
        "html5_accuracy_meters": random.randint(10, 50),
        "desktop_test": True # Enabling your bypass for testing
    }

    if scenario == "fraud_gyro":
        payload["gyroscope_variance"] = 0.0
        payload["desktop_test"] = False # To trigger real rejection
    
    if scenario == "fraud_dist":
        payload["html5_lat"] = 19.0760 # Mumbai
        payload["html5_lng"] = 72.8777
        payload["desktop_test"] = False # To trigger real distance rejection

    try:
        response = requests.post(API_URL, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # 1. Legit Users (Bypassing with desktop_test)
    for i in range(3):
        simulate_user(f"USER_LEGIT_{i}", "Legitimate Simulation", scenario="legit")
        time.sleep(0.5)

    # 2. Fraudulent User (Testing real rejection)
    simulate_user("USER_FRAUD_1", "Emulator Trigger (Gyro=0)", scenario="fraud_gyro")
    
    # 3. Geo-Fraud User (Testing real distance rejection)
    simulate_user("USER_FRAUD_2", "VPN Trigger (Far Distance)", scenario="fraud_dist")
