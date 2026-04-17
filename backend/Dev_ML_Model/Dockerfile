FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api_gateway.py .
# Uvicorn bound to 9000
CMD ["uvicorn", "api_gateway:app", "--host", "0.0.0.0", "--port", "9000"]
