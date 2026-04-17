import asyncio
import httpx
import random
import json
import time

API_BASE = "http://127.0.0.1:9000"
TOTAL_SAMPLES = 15000
CONCURRENCY = 50 # Send 50 requests at a time

# PERSONAS FOR DYNAMIC PRICING
def gen_pricing_payload(persona='normal'):
    payload = {
        "flood_risk_score": random.uniform(0.1, 0.9),
        "dist_to_river_km": random.uniform(0.5, 20.0),
        "dist_to_coast_km": random.uniform(1.0, 30.0),
        "drainage_quality_index": random.uniform(0.1, 1.0),
        "waterlogging_incidents_3y": random.randint(0, 10),
        "elevation_amsl_m": random.uniform(2.0, 15.0),
        "tenure_months": random.randint(1, 48),
        "avg_daily_earnings_rs": random.randint(500, 3000),
        "hours_per_week": random.randint(10, 80),
        "order_completion_rate": random.uniform(0.5, 1.0),
        "peak_hours_participation": random.uniform(0.1, 1.0),
        "rainfall_last_7d_mm": random.uniform(0, 500) if persona == 'edge' else random.uniform(0, 50),
        "cyclone_in_forecast": 1 if persona == 'edge' else 0,
        "reservoir_release_mm": random.uniform(0, 100),
        "aqi_level": random.randint(20, 400),
        "consecutive_rain_days": random.randint(0, 14),
        "week_of_year": random.randint(1, 52),
        "is_monsoon_season": 1 if random.random() > 0.5 else 0
    }
    return payload

# PERSONAS FOR FRAUD
def gen_fraud_payload(persona='normal'):
    is_fraud = (persona == 'edge' or random.random() < 0.2)
    return {
        "worker_id": f"WK-STRESS-{random.randint(10000, 99999)}",
        "claim_event_id": random.choice(["Sholinganallur", "Saidapet", "Ennore", "Tambaram", "Unknown_Zone"]),
        "device_fingerprint_hash": f"dev_{random.getrandbits(32)}",
        "gyroscope_variance": 0.0 if is_fraud else random.uniform(0.05, 0.3),
        "html5_lat": 13.08 + random.uniform(-0.05, 0.05),
        "html5_lng": 80.27 + random.uniform(-0.05, 0.05),
        "html5_accuracy_meters": random.randint(5, 500),
        "desktop_test": False if is_fraud else True
    }

# PERSONAS FOR RESERVE
def gen_reserve_payload(persona='normal'):
    zones = ["ZONE_CHN_001", "ZONE_CHN_002", "ZONE_CHN_003", "ZONE_CHN_004", "ZONE_CHN_005", "INVALID_ZONE"]
    return random.choice(zones) if persona == 'edge' else random.choice(zones[:-1])

async def fire_test(client, service_type, payload):
    try:
        if service_type == 'pricing':
            resp = await client.post(f"{API_BASE}/api/pricing/predict", json=payload, timeout=5.0)
        elif service_type == 'fraud':
            resp = await client.post(f"{API_BASE}/api/fraud/api/submit_claim", json=payload, timeout=5.0)
        elif service_type == 'reserve':
            resp = await client.get(f"{API_BASE}/api/reserve/ml/reserve/forecast/{payload}", timeout=5.0)
        return resp.status_code
    except Exception as e:
        return f"ERR: {str(e)}"

async def main():
    print(f"[START] Initializing Rigorous Stress Test: {TOTAL_SAMPLES} samples...")
    start_time = time.time()
    results = {"pricing": [], "fraud": [], "reserve": []}
    
    samples_per_model = TOTAL_SAMPLES // 3
    
    async with httpx.AsyncClient() as client:
        # PRICING BATCH
        print(f"[PRICING] Testing Pricing Model ({samples_per_model} reqs)...")
        for i in range(0, samples_per_model, CONCURRENCY):
            tasks = []
            for _ in range(CONCURRENCY):
                persona = 'edge' if random.random() < 0.1 else 'normal'
                tasks.append(fire_test(client, 'pricing', gen_pricing_payload(persona)))
            batch_results = await asyncio.gather(*tasks)
            results["pricing"].extend(batch_results)
            print(f"   Progress: {len(results['pricing'])}/{samples_per_model}", end='\r')

        # FRAUD BATCH
        print(f"\n[FRAUD] Testing Fraud Engine ({samples_per_model} reqs)...")
        for i in range(0, samples_per_model, CONCURRENCY):
            tasks = []
            for _ in range(CONCURRENCY):
                persona = 'edge' if random.random() < 0.1 else 'normal'
                tasks.append(fire_test(client, 'fraud', gen_fraud_payload(persona)))
            batch_results = await asyncio.gather(*tasks)
            results["fraud"].extend(batch_results)
            print(f"   Progress: {len(results['fraud'])}/{samples_per_model}", end='\r')

        # RESERVE BATCH
        print(f"\n[RESERVE] Testing Reserve Forecast ({samples_per_model} reqs)...")
        for i in range(0, samples_per_model, CONCURRENCY):
            tasks = []
            for _ in range(CONCURRENCY):
                persona = 'edge' if random.random() < 0.1 else 'normal'
                tasks.append(fire_test(client, 'reserve', gen_reserve_payload(persona)))
            batch_results = await asyncio.gather(*tasks)
            results["reserve"].extend(batch_results)
            print(f"   Progress: {len(results['reserve'])}/{samples_per_model}", end='\r')

    duration = time.time() - start_time
    print(f"\n\n[COMPLETE] STRESS TEST COMPLETE in {duration:.2f}s")
    
    # Save statistics
    report = {
        "summary": {
            "total_requests": TOTAL_SAMPLES,
            "duration_sec": duration,
            "throughput": TOTAL_SAMPLES / duration
        },
        "details": {
            k: {
                "200_ok": v.count(200),
                "errors": len([x for x in v if x != 200])
            } for k, v in results.items()
        }
    }
    
    with open("stress_test_report.json", "w") as f:
        json.dump(report, f, indent=4)
    
    print("\n[REPORT GENERATED: stress_test_report.json]")
    print(f"Pricing: {report['details']['pricing']['200_ok']} successes")
    print(f"Fraud: {report['details']['fraud']['200_ok']} successes")
    print(f"Reserve: {report['details']['reserve']['200_ok']} successes")

if __name__ == "__main__":
    asyncio.run(main())
