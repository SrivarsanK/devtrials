FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api_gateway.py .
# Uvicorn bound to 9000
CMD ["uvicorn", "api_gateway:app", "--host", "0.0.0.0", "--port", "9000"]
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all ML models and gateway
COPY . .

# Make entrypoint executable and fix line endings
RUN tr -d '\r' < entrypoint.sh > entrypoint.sh.new && mv entrypoint.sh.new entrypoint.sh && chmod +x entrypoint.sh

# Bootstrap the models (creates dummy files if missing)
RUN python Dynamic_pricing_model/ml_service/bootstrap_model.py
RUN python Reserve_model/bootstrap_reserve.py


# Expose Gateway port
EXPOSE 9000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=9000

# Start all services
CMD ["/bin/bash", "./entrypoint.sh"]
