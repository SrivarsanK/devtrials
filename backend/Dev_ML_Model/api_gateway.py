import httpx
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="GigShield Unified API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

SERVICES = {
    "fraud": os.getenv("FRAUD_SERVICE_URL", "http://127.0.0.1:5000"),
    "pricing": os.getenv("PRICING_SERVICE_URL", "http://127.0.0.1:8000"),
    "reserve": os.getenv("RESERVE_SERVICE_URL", "http://127.0.0.1:8002"),
}

@app.get("/")
def gateway_root():
    return {
        "message": "Unified GigShield ML API Gateway is Online",
        "available_services": {
            "fraud_detection": "/api/fraud/...",
            "dynamic_pricing": "/api/pricing/...",
            "reserve_model": "/api/reserve/..."
        }
    }

async def route_request(request: Request, service_url: str, path: str):
    url = f"{service_url}/{path}"
    
    # Extract query params if any
    query_params = request.url.query
    if query_params:
        url += f"?{query_params}"
        
    async with httpx.AsyncClient() as client:
        try:
            # Handle different HTTP methods
            if request.method == "GET":
                resp = await client.get(url)
            elif request.method == "POST":
                body = await request.json() if await request.body() else None
                resp = await client.post(url, json=body)
            else:
                raise HTTPException(status_code=405, detail="Method Not Allowed")
                
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers)
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {exc}")

# Dynamic Pricing Route
@app.api_route("/api/pricing/{path:path}", methods=["GET", "POST"])
async def proxy_pricing(request: Request, path: str):
    return await route_request(request, SERVICES["pricing"], path)

# Reserve Forecasting Route
@app.api_route("/api/reserve/{path:path}", methods=["GET", "POST"])
async def proxy_reserve(request: Request, path: str):
    return await route_request(request, SERVICES["reserve"], path)

# Fraud Detection Route
@app.api_route("/api/fraud/{path:path}", methods=["GET", "POST"])
async def proxy_fraud(request: Request, path: str):
    # Fraud endpoints like '/api/submit_claim' should be rewritten 
    # to target the Flask server base URL directly OR correctly appended.
    # Flask app has route `@app.route('/api/submit_claim')`
    # meaning the frontend calls `/api/fraud/api/submit_claim`. We will preserve the sub-path exactly.
    return await route_request(request, SERVICES["fraud"], path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
