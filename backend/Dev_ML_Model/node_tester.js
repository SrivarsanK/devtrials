const http = require('http');

const API_BASE = "http://127.0.0.1:9000";

async function firePricingTest() {
  const payload = {
      flood_risk_score: Math.random(),
      dist_to_river_km: Math.random() * 20,
      dist_to_coast_km: Math.random() * 30,
      drainage_quality_index: Math.random(),
      waterlogging_incidents_3y: Math.floor(Math.random() * 5),
      elevation_amsl_m: Math.random() * 10,
      tenure_months: 12,
      avg_daily_earnings_rs: 1500,
      hours_per_week: 40,
      order_completion_rate: 0.95,
      peak_hours_participation: 0.8,
      rainfall_last_7d_mm: Math.random() * 100,
      cyclone_in_forecast: Math.random() > 0.8 ? 1 : 0,
      reservoir_release_mm: Math.random() * 50,
      aqi_level: Math.floor(Math.random() * 300),
      consecutive_rain_days: Math.floor(Math.random() * 5),
      week_of_year: 15,
      is_monsoon_season: 0
  };

  try {
    const res = await fetch(`${API_BASE}/api/pricing/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("PRICING:", res.status);
  } catch (e) {
    console.log("PRICING ERROR", e.message);
  }
}

async function fireFraudTest() {
  const payload = {
    worker_id: `WK-STRESS-${Math.floor(Math.random() * 99999)}`,
    claim_event_id: ["Sholinganallur", "Saidapet", "Ennore", "Tambaram", "Unknown_Zone"][Math.floor(Math.random() * 5)],
    device_fingerprint_hash: `dev_${Math.floor(Math.random() * 1000000)}`,
    gyroscope_variance: Math.random(),
    html5_lat: 13.08 + (Math.random() * 0.1 - 0.05),
    html5_lng: 80.27 + (Math.random() * 0.1 - 0.05),
    html5_accuracy_meters: Math.floor(Math.random() * 500),
    desktop_test: Math.random() > 0.8 ? false : true
  };

  try {
    const res = await fetch(`${API_BASE}/api/fraud/api/submit_claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("FRAUD:", res.status);
  } catch (e) {
    console.log("FRAUD ERROR", e.message);
  }
}

async function fireReserveTest() {
  const zones = ["ZONE_CHN_001", "ZONE_CHN_002", "ZONE_CHN_003", "ZONE_CHN_004", "ZONE_CHN_005"];
  const z = zones[Math.floor(Math.random() * zones.length)];
  try {
    const res = await fetch(`${API_BASE}/api/reserve/ml/reserve/forecast/${z}`);
    console.log("RESERVE:", res.status);
  } catch (e) {
    console.log("RESERVE ERROR", e.message);
  }
}

async function start() {
    console.log("Starting Stress Tester...");
    for (let i = 0; i < 50; i++) {
        await Promise.all([
           firePricingTest(),
           fireFraudTest(),
           firePricingTest(),
           fireReserveTest(),
           firePricingTest(),
           fireReserveTest(),
           fireReserveTest()
        ]);
        await new Promise(r => setTimeout(r, 100)); // Sleep 100ms
    }
    console.log("Finished running payloads.");
}

start();
