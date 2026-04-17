import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from db import init_db, insert_claim, get_device_claim_count_24h, get_grouped_zones
from geo_utils import haversine, get_ip_geolocation
from fraud_rules import check_fraud

app = Flask(__name__)
CORS(app)

@app.before_request
def setup():
    init_db()

@app.route('/api/zones', methods=['GET'])
def fetch_zones():
    return jsonify(get_grouped_zones())


@app.route('/api/submit_claim', methods=['POST'])
def submit_claim():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON payload"}), 400

    # Required inputs from frontend
    fields = [
        'worker_id', 'claim_event_id', 'device_fingerprint_hash', 
        'gyroscope_variance', 'html5_lat', 'html5_lng', 'html5_accuracy_meters',
        'desktop_test'
    ]
    
    # Store locally to mutate/add info
    claim_data = {k: data.get(k) for k in fields}
    
    # Validate types/presence (basic)
    if None in [claim_data['html5_lat'], claim_data['html5_lng']]:
         return jsonify({"error": "Missing location"}), 400
    
    # 2. Extract client IP
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    # Handle comma-separated IPs from proxies
    if client_ip:
        client_ip = client_ip.split(',')[0].strip()
        
    claim_data['client_ip'] = client_ip

    # 3. IP Geolocation
    ip_lat, ip_lng = get_ip_geolocation(client_ip)
    claim_data['ip_lat'] = ip_lat
    claim_data['ip_lng'] = ip_lng

    # 4. Haversine Distance
    claim_data['ip_to_gps_distance_km'] = 0.0
    if ip_lat is not None and ip_lng is not None:
        try:
            claim_data['ip_to_gps_distance_km'] = haversine(
                float(claim_data['html5_lat']), float(claim_data['html5_lng']), 
                float(ip_lat), float(ip_lng)
            )
        except (ValueError, TypeError):
             claim_data['ip_to_gps_distance_km'] = 0.0

    # 5. Device Farm Check
    device_count = get_device_claim_count_24h(claim_data['device_fingerprint_hash'])

    # 6. Run Fraud Rules
    status_code, result = check_fraud(claim_data, device_count)
    
    claim_data['outcome'] = result.get('outcome')
    claim_data['rule_triggered'] = result.get('error')

    # 7. Insert DB
    insert_claim(claim_data)
    
    # Clean up output
    out = {k: v for k, v in result.items() if k != 'outcome'}
    return jsonify(out), status_code

if __name__ == '__main__':
    # Initialize DB on start
    init_db()
    app.run(port=5000, debug=True)
