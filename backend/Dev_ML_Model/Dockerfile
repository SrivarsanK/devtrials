FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all ML models and gateway code
COPY . .

# Make entrypoint executable and fix Windows line endings
RUN tr -d '\r' < entrypoint.sh > entrypoint.sh.new && mv entrypoint.sh.new entrypoint.sh && chmod +x entrypoint.sh

# Bootstrap the models (creates dummy files if missing)
RUN python Dynamic_pricing_model/ml_service/bootstrap_model.py
RUN python Reserve_model/bootstrap_reserve.py

# Expose Gateway port
EXPOSE 9000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=9000

# Start all services via entrypoint
CMD ["/bin/bash", "./entrypoint.sh"]
