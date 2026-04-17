import math
import requests

def haversine(lat1, lon1, lat2, lon2):
    # Returns distance in km
    R = 6371.0 # Earth radius km
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def get_ip_geolocation(ip):
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}?fields=lat,lon,status", timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "success":
                return data.get("lat"), data.get("lon")
    except Exception:
        pass
    return None, None
