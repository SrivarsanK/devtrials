from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import numpy as np
import os
from pipeline import pipeline

app = FastAPI(title="GigShield Reserve Forecasting API", version="1.0.1")

# Mapped Chennai Zones (DevTrails Spec)
ZONES = {
    "ZONE_CHN_001": {"area": "Tambaram", "risk": "Red", "reserve": 100000},
    "ZONE_CHN_002": {"area": "Velachery", "risk": "Red", "reserve": 85000},
    "ZONE_CHN_003": {"area": "Adyar", "risk": "Amber", "reserve": 60000},
    "ZONE_CHN_004": {"area": "Anna Nagar", "risk": "Amber", "reserve": 50000},
    "ZONE_CHN_005": {"area": "T. Nagar", "risk": "Amber", "reserve": 55000},
    "ZONE_CHN_006": {"area": "Nungambakkam", "risk": "Green", "reserve": 30000}
}

class ForecastResponse(BaseModel):
    zone_id: str
    area: str
    risk_level: str
    predicted_claims_next_7_days: int
    predicted_payout_next_7_days: float
    reserve_status: str
    status_logic: dict

@app.get("/")
def read_root():
    return {"message": "GigShield Reserve Forecasting Engine (LSTM) is online"}

@app.get("/ml/reserve/forecast/{zone_id}", response_model=ForecastResponse)
async def get_reserve_forecast(zone_id: str):
    if zone_id not in ZONES:
        raise HTTPException(status_code=404, detail="Zone ID not found in Chennai Registry")

    zone_info = ZONES[zone_id]
    
    # In a real system, we'd fetch the last 14 days of data for this zone from a database
    # For now, we'll use the pipeline to generate a realistic prediction (mocking input)
    try:
        claims, payout = pipeline.predict_reserve_needs()
        
        # Determine reserve status based on predicted payout vs allocated reserve
        current_reserve = zone_info["reserve"]
        usage_pct = (payout / current_reserve) * 100 if current_reserve > 0 else 0
        
        if usage_pct < 60:
            reserve_status = "GREEN"
        elif 60 <= usage_pct <= 85:
            reserve_status = "AMBER"
        else:
            reserve_status = "RED"
            
        return {
            "zone_id": zone_id,
            "area": zone_info["area"],
            "risk_level": zone_info["risk"],
            "predicted_claims_next_7_days": claims,
            "predicted_payout_next_7_days": round(payout, 2),
            "reserve_status": reserve_status,
            "status_logic": {
                "GREEN": "Predicted payout below 60% of reserve",
                "AMBER": "Predicted payout between 60-85% of reserve",
                "RED": "Predicted payout above 85% of reserve"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

@app.get("/health")
@app.get("/system")
def health():
    return {
        "status": "healthy",
        "model_loaded": pipeline.model is not None,
        "engine": "LSTM (Sequence: 14 past -> 7 future)",
        "city": "Chennai"
    }

@app.get("/dashboard", response_class=HTMLResponse)
@app.get("/health/dashboard", response_class=HTMLResponse)
def reserve_dashboard():
    # Build a simple but high-fidelity summary dashboard
    forecasts = []
    for zid, info in ZONES.items():
        try:
            claims, payout = pipeline.predict_reserve_needs()
            usage_pct = (payout / info["reserve"]) * 100 if info["reserve"] > 0 else 0
            
            if usage_pct < 60: 
                status = "GREEN"; color = "#10b981"
            elif usage_pct <= 85: 
                status = "AMBER"; color = "#f59e0b"
            else: 
                status = "RED"; color = "#ef4444"
                
            forecasts.append({"id": zid, "area": info["area"], "reserve": info["reserve"], "pred_claims": claims, "pred_payout": round(payout, 2), "status": status, "color": color, "usage": round(usage_pct, 1)})
        except: continue

    zone_html = "".join([f"""
    <div style="background: rgba(23, 28, 45, 0.8); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; padding: 1.5rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; font-size: 1.25rem;">{f['area']} <span style="font-size: 0.7rem; color: #94a3b8;">{f['id']}</span></h3>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: {f['color']}; box-shadow: 0 0 10px {f['color']};"></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.75rem;">
                <label style="font-size: 0.6rem; color: #94a3b8; text-transform: uppercase;">Next 7D Claims</label>
                <div style="font-size: 1.1rem; font-weight: 700;">{f['pred_claims']}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.75rem;">
                <label style="font-size: 0.6rem; color: #94a3b8; text-transform: uppercase;">Next 7D Payout</label>
                <div style="font-size: 1.1rem; font-weight: 700;">₹{f['pred_payout']:,}</div>
            </div>
        </div>
        <div style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 0.25rem;">
                <span>Utilization</span>
                <span style="color: {f['color']};">{f['usage']}%</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: {min(f['usage'], 100)}%; background: {f['color']};"></div>
            </div>
        </div>
    </div>""" for f in forecasts])

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"><title>GigShield Reserve Monitor</title>
        <style>
            body {{ background: #0b0f1a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: auto; }}
            h1 {{ font-size: 2.5rem; margin-bottom: 0.5rem; }}
            .pill {{ background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.4rem 0.8rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2); }}
        </style>
    </head>
    <body>
        <header style="margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <p style="color: #ff4625; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;">Actuarial Intelligence</p>
                <h1>Reserve Monitor</h1>
            </div>
            <span class="pill">LSTM ENGINE ACTIVE</span>
        </header>
        {zone_html}
    </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
