import sqlite3
import os

# Move DB to hidden folder to avoid Live Server auto-refreshes
DB_DIR = os.path.join(os.path.dirname(__file__), '.data')
if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)

DB_PATH = os.path.join(DB_DIR, 'fraud_engine.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS claims (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id TEXT,
                claim_event_id TEXT,
                device_fingerprint_hash TEXT,
                gyroscope_variance REAL,
                html5_lat REAL,
                html5_lng REAL,
                html5_accuracy_meters REAL,
                client_ip TEXT,
                ip_lat REAL,
                ip_lng REAL,
                ip_to_gps_distance_km REAL,
                rule_triggered TEXT,
                outcome TEXT,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS zones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                region TEXT,
                zone_color TEXT
            )
        ''')
        
        # Check if zones table is empty
        cursor = conn.execute("SELECT COUNT(*) FROM zones")
        if cursor.fetchone()[0] == 0:
            zones_data = [
                # RED ZONES
                ("Sholinganallur", "South Chennai (OMR)", "red"),
                ("Karapakkam", "South Chennai (OMR)", "red"),
                ("Thiruvanmiyur", "Coastal South", "red"),
                ("Saidapet", "Central-South", "red"),
                ("Kotturpuram", "Central-South", "red"),
                ("Jafferkhanpet", "Central-South", "red"),
                ("Nandambakkam", "Central-South", "red"),
                ("Ennore", "North Chennai", "red"),
                ("Manali", "North Chennai", "red"),
                ("Kolathur", "North Chennai", "red"),
                ("Vyasarpadi", "North Chennai", "red"),
                ("Wimco Nagar", "North Chennai", "red"),
                ("Tiruvottiyur", "North Chennai", "red"),
                ("Royapuram", "North Chennai (Coastal)", "red"),
                ("Tondiarpet", "North Chennai", "red"),
                ("Guindy", "Central-South", "red"),
                ("Perungudi", "South Chennai (OMR)", "red"),
                ("Perambur", "North Chennai", "red"),
                
                # ORANGE ZONES
                ("Velachery", "South Chennai", "orange"),
                ("Pallikaranai", "South Chennai", "orange"),
                ("Madipakkam", "South Chennai", "orange"),
                ("Perumbakkam", "South Chennai", "orange"),
                ("Semmencherry", "South Chennai", "orange"),
                ("Adyar Estuarine Belt", "South Chennai", "orange"),
                ("Sunnambu Kolathur", "South Chennai", "orange"),
                ("Ambattur", "West Chennai", "orange"),
                ("Avadi", "North-West Chennai", "orange"),
                ("Porur", "West Chennai", "orange"),
                ("Chrompet", "South-West Chennai", "orange"),
                ("Pallavaram", "South-West Chennai", "orange"),
                ("Tambaram", "South-West Chennai", "orange"),
                ("Medavakkam", "South Chennai", "orange"),
                ("Nanganallur", "South Chennai", "orange"),
                ("Meenambakkam", "South-West Chennai", "orange"),
                ("Egmore", "Central", "orange"),
                ("Chepauk", "Central-East", "orange"),
                ("Mylapore", "Central-East", "orange"),
                ("Triplicane", "Central-East", "orange"),
                ("Royapettah", "Central-East", "orange"),
                ("Virugambakkam", "West Chennai", "orange"),
                ("Valasaravakkam", "West Chennai", "orange"),
                ("Mogappair", "North-West Chennai", "orange"),
                ("Poonamallee", "West Chennai", "orange"),
                ("Korattur", "North-West Chennai", "orange"),
                ("Anna Nagar", "North-West Chennai", "orange"),
                ("Adyar", "South Chennai", "orange"),
                
                # GREEN ZONES
                ("Nungambakkam", "Central", "green"),
                ("T Nagar", "Central", "green"),
                ("Kilpauk", "Central", "green"),
                ("Teynampet", "Central", "green"),
                ("Alwarpet", "Central-South", "green"),
                ("Thousand Lights", "Central", "green"),
                ("Choolaimedu", "Central-West", "green"),
                ("Vadapalani", "Central-West", "green"),
                ("Saligramam", "West Chennai", "green"),
                ("Ashok Nagar", "Central-West", "green"),
                ("Kodambakkam", "Central-West", "green"),
                ("Purasaiwakkam", "North-Central", "green"),
                ("Aminjikarai", "Central-West", "green"),
                ("Besant Nagar", "South Coastal", "green"),
                ("Nandanam", "Central", "green"),
                ("Santhome", "Central-East", "green")
            ]
            
            conn.executemany('''
                INSERT INTO zones (name, region, zone_color) 
                VALUES (?, ?, ?)
            ''', zones_data)
            
def get_grouped_zones():
    with get_db() as conn:
        cursor = conn.execute("SELECT name, region, zone_color FROM zones")
        rows = cursor.fetchall()
        
    grouped = {"red": [], "orange": [], "green": []}
    for row in rows:
        color = row["zone_color"]
        if color in grouped:
            grouped[color].append({"name": row["name"], "region": row["region"], "zone": color})
    
    return grouped

def get_device_claim_count_24h(device_hash):
    with get_db() as conn:
        cursor = conn.execute('''
            SELECT COUNT(*) FROM claims 
            WHERE device_fingerprint_hash = ? 
            AND submitted_at > datetime('now', '-24 hours')
        ''', (device_hash,))
        return cursor.fetchone()[0]

def insert_claim(data):
    with get_db() as conn:
        conn.execute('''
            INSERT INTO claims (
                worker_id, claim_event_id, device_fingerprint_hash,
                gyroscope_variance, html5_lat, html5_lng, html5_accuracy_meters,
                client_ip, ip_lat, ip_lng, ip_to_gps_distance_km,
                rule_triggered, outcome
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('worker_id'), data.get('claim_event_id'), data.get('device_fingerprint_hash'),
            data.get('gyroscope_variance'), data.get('html5_lat'), data.get('html5_lng'), data.get('html5_accuracy_meters'),
            data.get('client_ip'), data.get('ip_lat'), data.get('ip_lng'), data.get('ip_to_gps_distance_km'),
            data.get('rule_triggered'), data.get('outcome')
        ))
