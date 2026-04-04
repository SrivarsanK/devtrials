from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
import psutil
import platform
import time
from fastapi.responses import HTMLResponse
from inference_engine import GigShieldFraudEngine

# Start time for uptime calculation
START_TIME = time.time()

# Define FastAPI App
app = FastAPI(
    title="GigShield Advanced Fraud Detection API",
    description="ML Scoring Engine for Claim Disruption Fraud Detection (v2.0)",
    version="2.0"
)

# Initialize Engine
# Resolve path: models/app.py -> models/.. -> ../.. -> exports/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
export_path = os.path.join(PROJECT_ROOT, "exports")

print(f"GigShield: Searching for model artifacts in: {export_path}")
engine = GigShieldFraudEngine(model_dir=export_path)
engine.load_artifacts()

# Pydantic Models for Input Validation
class ClaimFeatures(BaseModel):
    worker_id: int
    zone_name: str = "Unknown"
    latency_ms: float = 40.0
    vpn_detected: bool = False
    dns_leak_detected: bool = False
    asn_whitelisted: bool = True
    cell_mismatch_count: int = 0
    location_trust_tier: int = 1
    mock_location_enabled: bool = False
    satellite_count: int = 18
    altitude_variance: float = 0.5
    is_emulator: bool = False
    device_cluster_size: int = 1
    same_device_accounts: int = 1
    behavioral_similarity_score: float = 0.9
    sim_risk_score: float = 0.1
    time_since_sim_change_hrs: float = 1000.0
    cluster_suspicious_score: float = 0.05
    cluster_size_last_24h: int = 1
    weather_event_confirmed: bool = True
    account_age_days: int = 200
    orders_during_window: int = 0
    battery_drain_rate: float = 0.1
    same_bank_accounts: int = 1
    zone_priority_mismatch: bool = False
    cross_zone_claim: bool = False
    # ... more fields as per Section 2 spec

@app.get("/health")
async def health_check():
    """
    Enhanced Health Check with System Metrics.
    """
    uptime = time.time() - START_TIME
    cpu_usage = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    health_status = {
        "status": "healthy" if engine.is_loaded else "degraded",
        "timestamp": datetime.now().isoformat(),
        "model_version": "2.0",
        "engine_loaded": engine.is_loaded,
        "system_metrics": {
            "uptime_seconds": round(uptime, 2),
            "cpu_percent": cpu_usage,
            "memory_percent": memory.percent,
            "memory_available_mb": round(memory.available / (1024 * 1024), 2),
            "disk_percent": disk.percent,
            "platform": platform.system(),
            "python_version": platform.python_version()
        },
        "artifacts_found": [f for f in os.listdir(export_path)] if os.path.exists(export_path) else []
    }
    return health_status

@app.get("/health/dashboard", response_class=HTMLResponse)
async def health_dashboard():
    """
    Visual System Health Dashboard for GigShield.
    """
    health = await health_check()
    metrics = health["system_metrics"]
    
    status_color = "#10b981" if health["status"] == "healthy" else "#f59e0b"
    
    html_content = f"""
    <html>
        <head>
            <title>GigShield Health Dashboard</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta http-equiv="refresh" content="5">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body {{ font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }}
                .stat-card {{ background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid #334155; }}
            </style>
        </head>
        <body class="p-8">
            <div class="max-w-4xl mx-auto">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-white flex items-center">
                        <span class="w-4 h-4 rounded-full mr-3 animate-pulse" style="background-color: {status_color}"></span>
                        GigShield <span class="text-indigo-400 ml-2">System Health</span>
                    </h1>
                    <div class="text-right">
                        <p class="text-slate-400 text-sm">Last Updated</p>
                        <p class="text-indigo-300 font-mono text-sm">{health['timestamp']}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="stat-card p-6 rounded-2xl">
                        <p class="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">CPU Usage</p>
                        <p class="text-4xl font-bold text-indigo-400">{metrics['cpu_percent']}%</p>
                        <div class="w-full bg-slate-700 h-2 mt-4 rounded-full overflow-hidden">
                            <div class="bg-indigo-500 h-full" style="width: {metrics['cpu_percent']}%"></div>
                        </div>
                    </div>
                    <div class="stat-card p-6 rounded-2xl">
                        <p class="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Memory</p>
                        <p class="text-4xl font-bold text-emerald-400">{metrics['memory_percent']}%</p>
                        <div class="w-full bg-slate-700 h-2 mt-4 rounded-full overflow-hidden">
                            <div class="bg-emerald-500 h-full" style="width: {metrics['memory_percent']}%"></div>
                        </div>
                    </div>
                    <div class="stat-card p-6 rounded-2xl">
                        <p class="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Disk Space</p>
                        <p class="text-4xl font-bold text-amber-400">{metrics['disk_percent']}%</p>
                        <div class="w-full bg-slate-700 h-2 mt-4 rounded-full overflow-hidden">
                            <div class="bg-amber-500 h-full" style="width: {metrics['disk_percent']}%"></div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="stat-card p-6 rounded-2xl">
                        <h2 class="text-lg font-bold mb-4 text-white">Engine Details</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between border-b border-slate-700 pb-2">
                                <span class="text-slate-400">Model Version</span>
                                <span class="font-mono text-indigo-300">{health['model_version']}</span>
                            </div>
                            <div class="flex justify-between border-b border-slate-700 pb-2">
                                <span class="text-slate-400">Engine Status</span>
                                <span class="text-emerald-400 font-bold">READY</span>
                            </div>
                            <div class="flex justify-between border-b border-slate-700 pb-2">
                                <span class="text-slate-400">Uptime</span>
                                <span class="font-mono">{metrics['uptime_seconds']}s</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat-card p-6 rounded-2xl">
                        <h2 class="text-lg font-bold mb-4 text-white">Model Artifacts</h2>
                        <ul class="text-sm font-mono text-slate-300 space-y-1">
                            {"".join([f"<li>✅ {a}</li>" for a in health['artifacts_found'][:5]])}
                            {f"<li>... and {len(health['artifacts_found'])-5} more</li>" if len(health['artifacts_found']) > 5 else ""}
                        </ul>
                    </div>
                </div>
                
                <footer class="mt-8 text-center text-slate-500 text-xs">
                    Powering KAVACH | Guidewire DEVTrails 2026
                </footer>
            </div>
        </body>
    </html>
    """
    return html_content

@app.post("/ml/fraud/score")
async def score_claim(features: ClaimFeatures):
    """
    Primary Fraud Detection endpoint.
    Returns scores, decisions, and threshold details for a claim.
    """
    if not engine.is_loaded:
        raise HTTPException(status_code=503, detail="Model artifacts not yet loaded in backend.")
    
    try:
        # Convert Pydantic object to dictionary
        raw_input = features.dict()
        
        # Core scoring
        result = engine.score_claim(raw_input)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Add metadata per spec (Section 12 and 14)
        result["timestamp"] = datetime.now().isoformat()
        result["status"] = "PROCESSED"
        
        # Dummy "top signals" for demo (real SHAP integration in production)
        if result["adjusted_score"] > 0.5:
            result["top_fraud_signals"] = ["vpn_risk_score_model", "cell_mismatch_count", "zone_fraud_baseline"]
        else:
            result["top_fraud_signals"] = []
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Failure: {str(e)}")

@app.get("/ml/zone/priority")
async def get_zone_priority(zone: str):
    """
    Fetch priority-based risk details for a Chennai zone.
    """
    if engine.zone_lookup is None:
        raise HTTPException(status_code=503, detail="Zone lookup data not loaded.")
    
    res = engine.zone_lookup[engine.zone_lookup['zone_name'] == zone]
    if res.empty:
        raise HTTPException(status_code=404, detail=f"Zone '{zone}' not found in Chennai Priority Map.")
    
    zone_data = res.iloc[0].to_dict()
    return {
        "zone_name": zone,
        "zone_priority": int(zone_data['zone_priority']),
        "zone_cluster_id": int(zone_data['zone_cluster_id']),
        "zone_score_offset": float(zone_data['zone_score_offset']),
        "zone_fraud_baseline": float(zone_data['zone_fraud_baseline'])
    }

@app.post("/ml/premium/calculate")
async def calculate_premium(data: dict = Body(...)):
    """
    Dynamic Pricing placeholder (per Step 1 of spec).
    Calculates premium multiplier based on zone risk.
    """
    zone_name = data.get("zone_name", "Unknown")
    offset, priority = engine.get_zone_data(zone_name)
    
    # Premium multiplier logic: P1 zones have +20% premium, P3 zones have -10% discount.
    multiplier = 1.0
    if priority == 1:
        multiplier = 1.2
    elif priority == 3:
        multiplier = 0.9
        
    return {
        "premium_multiplier": multiplier,
        "zone_risk_tier": f"P{priority}",
        "base_premium_adjustment": offset
    }

@app.get("/ml/reserve/forecast")
async def reserve_forecast():
    """
    Reserve forecasting placeholder (per spec). 
    Predicts if current claim payouts will exceed safety pools.
    """
    return {
        "predicted_claims_24h": 450,
        "predicted_payout_inr": 3600000,
        "reserve_status": "GREEN", # GREEN/AMBER/RED
        "implied_risk_rate": 0.12
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to GigShield Advanced Fraud Detection API v2.0",
        "docs": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
