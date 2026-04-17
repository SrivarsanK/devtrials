import requests
import json

payload = {
  "flood_risk_score": 0.9,
  "rainfall_last_7d_mm": 210.0,
  "cyclone_in_forecast": 1,
  "reservoir_release_mm": 60.0,
  "aqi_level": 250,
  "consecutive_rain_days": 4,
  "week_of_year": 48,
  "is_monsoon_season": 1,
  "avg_daily_earnings_rs": 1800,
  "hours_per_week": 60
}

try:
    response = requests.post("http://localhost:8000/predict", json=payload)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
