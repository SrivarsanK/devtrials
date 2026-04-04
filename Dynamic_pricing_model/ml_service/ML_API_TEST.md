# Manual Test Scenarios for RideSuraksha ML API

You can test the API by sending POST requests to `http://localhost:8000/predict` with the following JSON payloads.

---

### Scenario 1: T.Nagar Dry Summer
**Description**: Baseline minimum — safest possible week in a high-risk zone.
**Expected**: Premium close to ₹20-25, Low risk tier, AI factor ~0.80.

```json
{
  "flood_risk_score": 0.3,
  "dist_to_river_km": 2.0,
  "dist_to_coast_km": 5.0,
  "drainage_quality_index": 0.8,
  "waterlogging_incidents_3y": 12,
  "elevation_amsl_m": 8.0,
  "tenure_months": 24,
  "avg_daily_earnings_rs": 1400,
  "hours_per_week": 40,
  "order_completion_rate": 0.98,
  "peak_hours_participation": 0.7,
  "rainfall_last_7d_mm": 5.0,
  "cyclone_in_forecast": 0,
  "reservoir_release_mm": 0.0,
  "aqi_level": 80,
  "consecutive_rain_days": 0,
  "week_of_year": 20,
  "is_monsoon_season": 0
}
```

---

### Scenario 3: T.Nagar Cyclone Week
**Description**: Maximum stress test — compound disaster pricing.
**Expected**: Premium close to ₹48.50, High risk tier (90%+ probability), AI factor ~1.18x.

```json
{
  "flood_risk_score": 0.9,
  "dist_to_river_km": 2.0,
  "dist_to_coast_km": 5.0,
  "drainage_quality_index": 0.3,
  "waterlogging_incidents_3y": 45,
  "elevation_amsl_m": 4.0,
  "tenure_months": 24,
  "avg_daily_earnings_rs": 1800,
  "hours_per_week": 60,
  "order_completion_rate": 0.85,
  "peak_hours_participation": 0.9,
  "rainfall_last_7d_mm": 210.0,
  "cyclone_in_forecast": 1,
  "reservoir_release_mm": 60.0,
  "aqi_level": 250,
  "consecutive_rain_days": 4,
  "week_of_year": 48,
  "is_monsoon_season": 1
}
```

---

### Run Internal Test Script (Python)
You can also run this script to see the model output directly:

```python
import requests
import json

url = "http://localhost:8000/predict"
payload = {
  "flood_risk_score": 0.9,
  "rainfall_last_7d_mm": 210.0,
  "cyclone_in_forecast": 1,
  "reservoir_release_mm": 60.0,
  "aqi_level": 250,
  "consecutive_rain_days": 4
  # (and other fields)
}
response = requests.post(url, json=payload)
print(response.json())
```
