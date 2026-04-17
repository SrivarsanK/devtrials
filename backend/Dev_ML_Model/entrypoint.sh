#!/bin/bash

# Start Fraud Heuristic (Flask)
cd /app/Fraud_detect_heuristic/Fraud_detect_heuristic/fraud-engine/backend
python app.py &

# Start Dynamic Pricing (FastAPI)
cd /app/Dynamic_pricing_model/ml_service
python main.py &

# Start Reserve Forecasting (FastAPI)
cd /app/Reserve_model
python main.py &

# Start API Gateway (FastAPI) - Foreground
cd /app
python api_gateway.py
