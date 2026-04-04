from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import torch
import numpy as np
import os
from pipeline import pipeline
import model as shield_model

app = FastAPI(title="GigShield Dynamic Pricing API", version="1.0.0")

# Model path relative to root
MODEL_PATH = os.getenv("MODEL_PATH", "../ml_pipeline/models/shieldguard_scripted.pt")

# Initialize model
model = None
try:
    # Prefer loading scripted model (TorchScript) if available for faster inference
    if os.path.exists(MODEL_PATH):
        try:
            model = torch.jit.load(MODEL_PATH, map_location='cpu')
            print(f"Successfully loaded scripted model from {MODEL_PATH}")
        except Exception as jit_e:
            print(f"Failed to load scripted model: {jit_e}")
            # Try loading non-scripted model as fallback
            model = shield_model.ShieldGuardNet(input_dim=38)
            state_dict_path = "../ml_pipeline/models/shieldguard_net.pt"
            if os.path.exists(state_dict_path):
                model.load_state_dict(torch.load(state_dict_path, map_location=torch.device('cpu'), weights_only=False))
                print(f"Successfully loaded model state dict from {state_dict_path}")
            else:
                print(f"Fallback state dict not found at {state_dict_path}")
    else:
        print(f"Model file not found at {MODEL_PATH}")
    
    if model:
        model.eval()
    else:
        print("CRITICAL: No model initialized!")
except Exception as e:
    print(f"Error during overall model initialization: {e}")

class RiderInput(BaseModel):
    # Zone Data
    flood_risk_score: float = 0.5
    dist_to_river_km: float = 5.0
    dist_to_coast_km: float = 10.0
    drainage_quality_index: float = 0.5
    waterlogging_incidents_3y: int = 2
    elevation_amsl_m: float = 6.0
    
    # Rider Data
    tenure_months: int = 12
    avg_daily_earnings_rs: float = 1500
    hours_per_week: float = 40
    order_completion_rate: float = 0.95
    peak_hours_participation: float = 0.8
    
    # Weather / Live Data
    rainfall_last_7d_mm: float = 0.0
    cyclone_in_forecast: int = 0
    reservoir_release_mm: float = 0.0
    aqi_level: int = 150
    consecutive_rain_days: int = 0
    week_of_year: int = 1
    is_monsoon_season: int = 0

@app.get("/")
def read_root():
    return {"message": "GigShield Dynamic Pricing API is online"}

@app.get("/health")
@app.get("/system")
def health_check():
    return {
        "status": "healthy" if model is not None else "degraded",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "device": "cpu", # Force CPU as per model mapping
        "version": "1.0.0",
        "service": "gigshield-ml-pricing"
    }

@app.get("/dashboard", response_class=HTMLResponse)
@app.get("/health/dashboard", response_class=HTMLResponse)
def health_dashboard():
    status_color = "#10b981" if model is not None else "#ef4444"
    status_text = "Operational" if model is not None else "Degraded"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GigShield ML Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@500;700&display=swap" rel="stylesheet">
        <style>
            :root {{
                --bg: #0f172a;
                --card-bg: rgba(30, 41, 59, 0.7);
                --accent: #3b82f6;
                --text: #f1f5f9;
                --text-muted: #94a3b8;
                --status-ok: #10b981;
                --status-err: #ef4444;
            }}
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 3rem 1rem;
                background-image: radial-gradient(circle at top left, rgba(59, 130, 246, 0.1), transparent),
                                  radial-gradient(circle at bottom right, rgba(139, 92, 246, 0.1), transparent);
            }}
            .dashboard {{
                width: 100%;
                max-width: 800px;
                animation: fadeIn 0.8s ease-out;
            }}
            @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
            
            header {{
                margin-bottom: 2.5rem;
                text-align: center;
            }}
            h1 {{
                font-family: 'Outfit', sans-serif;
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }}
            .tagline {{ color: var(--text-muted); font-size: 1.1rem; }}
            
            .card {{
                background: var(--card-bg);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 1.5rem;
                padding: 2.5rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }}
            
            .status-banner {{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
                padding-bottom: 2rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }}
            .status-label {{ font-size: 1.2rem; font-weight: 600; }}
            .status-indicator {{
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: {status_color};
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}
            .pulse {{
                width: 12px;
                height: 12px;
                background: {status_color};
                border-radius: 50%;
                box-shadow: 0 0 0 0 {status_color}88;
                animation: pulse 2s infinite;
            }}
            @keyframes pulse {{
                0% {{ transform: scale(0.95); box-shadow: 0 0 0 0 {status_color}bb; }}
                70% {{ transform: scale(1); box-shadow: 0 0 0 10px {status_color}00; }}
                100% {{ transform: scale(0.95); box-shadow: 0 0 0 0 {status_color}00; }}
            }}
            
            .grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }}
            .stat-box {{
                background: rgba(15, 23, 42, 0.4);
                padding: 1.25rem;
                border-radius: 1rem;
                border: 1px solid rgba(255, 255, 255, 0.03);
            }}
            .stat-label {{ color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }}
            .stat-value {{ font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 600; word-break: break-all; }}
            
            footer {{
                margin-top: 3rem;
                color: var(--text-muted);
                font-size: 0.9rem;
                opacity: 0.6;
            }}
        </style>
    </head>
    <body>
        <div class="dashboard">
            <header>
                <h1>GigShield ML Core</h1>
                <p class="tagline">Dynamic Pricing Engine Status</p>
            </header>
            
            <div class="card">
                <div class="status-banner">
                    <span class="status-label">System Integrity</span>
                    <div class="status-indicator">
                        <div class="pulse"></div>
                        {status_text}
                    </div>
                </div>
                
                <div class="grid">
                    <div class="stat-box">
                        <p class="stat-label">Model Status</p>
                        <p class="stat-value">{'Active' if model else 'Disconnected'}</p>
                    </div>
                    <div class="stat-box">
                        <p class="stat-label">Compute Device</p>
                        <p class="stat-value">CPU (Inference Optimized)</p>
                    </div>
                    <div class="stat-box">
                        <p class="stat-label">API Version</p>
                        <p class="stat-value">1.0.0-PROD</p>
                    </div>
                    <div class="stat-box" style="grid-column: span 2;">
                        <p class="stat-label">Model Checkpoint</p>
                        <p class="stat-value">{MODEL_PATH}</p>
                    </div>
                </div>
            </div>
            
            <footer style="text-align: center;">
                &copy; 2026 GigShield Insurance Technology. All systems nominal.
            </footer>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/predict")
def predict(input_data: RiderInput):
    if model is None:
        raise HTTPException(status_code=500, detail="ML model not initialized")
    
    try:
        # Preprocess input using the pipeline
        feature_vector = pipeline.transform(input_data.dict())
        feature_tensor = torch.tensor(feature_vector)
        
        # Inference
        with torch.no_grad():
            factor, premium, tier_logits = model(feature_tensor)
            
            # Post-process outputs
            ai_adjustment_factor = float(factor.item())
            final_premium_rs = float(premium.item())
            
            # Categorize risk tier (LOW, MEDIUM, HIGH)
            tier_idx = torch.argmax(tier_logits, dim=1).item()
            risk_tiers = ["LOW", "MEDIUM", "HIGH"]
            risk_tier = risk_tiers[tier_idx]
            
            # Softmax for probabilities
            tier_probs = torch.softmax(tier_logits, dim=1)[0].tolist()
            
            return {
                "ai_adjustment_factor": round(ai_adjustment_factor, 2),
                "final_premium_rs": round(final_premium_rs, 2),
                "risk_tier": risk_tier,
                "tier_probabilities": {
                    "LOW": round(tier_probs[0], 4),
                    "MEDIUM": round(tier_probs[1], 4),
                    "HIGH": round(tier_probs[2], 4)
                },
                "status": "success"
            }
            
    except Exception as e:
        import traceback
        err_msg = traceback.format_exc()
        print(err_msg)
        raise HTTPException(status_code=400, detail=f"Prediction error ({type(e).__name__}): {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
