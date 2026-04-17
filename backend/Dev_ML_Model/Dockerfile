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

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Expose Gateway port
EXPOSE 9000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=9000

# Start all services
CMD ["./entrypoint.sh"]
