# Architecture

The GigShield application follows a multi-layered architecture designed for scalability, real-time data processing, and integration with machine learning models.

## High-Level Architecture

The system is composed of the following primary layers:

1. **Client Layer:**
   * **Worker PWA:** A Progressive Web App built with Next.js and React, providing gig workers with offline capabilities and a mobile-first experience.
   * **Insurer Dashboard:** A web-based application built with Next.js and React for insurers to monitor policies, claims, and real-time metrics, utilizing Socket.io for live updates.
   * **Platform Portal:** An integration interface (currently mocked) for gig platforms (e.g., Swiggy, Zomato).

2. **API Gateway:**
   * Acts as the single entry point for all client requests.
   * Built with Node.js and Express for RESTful endpoints.
   * Utilizes Socket.io to push real-time events to the Insurer Dashboard.

3. **Core Services:**
   * **Policy Service:** Manages the lifecycle of micro-policies.
   * **Claims Service:** Handles claim requests and automated payouts.
   * **Trigger Service:** Monitors external data sources (weather, traffic, AQI) to parameterize policies.
   * **Fraud Detection Service:** Interfaces with the ML layer to analyze risky behaviors or claims.
   * **Premium Service:** Calculates dynamic premiums based on risk factors via the ML layer.

4. **Machine Learning (ML) Layer:**
   * A dedicated FastAPI service hosting trained ML models for fast inference.
   * **Models:** XGBoost (dynamic premium pricing), Isolation Forest (fraud detection), and LSTM (demand/risk forecasting).

5. **Data Layer:**
   * **Primary Database:** PostgreSQL with the TimescaleDB extension optimized for time-series data (e.g., weather events, location tracking).
   * **Caching & Job Queue:** Redis, used for caching frequent queries, session management, and running background jobs (via Celery or BullMQ).

## Communication Flow

* **Synchronous:** Clients communicate with the API Gateway via REST over HTTP/HTTPS.
* **Asynchronous/Real-time:** The API Gateway pushes updates to the Insurer Dashboard using WebSockets (Socket.io).
* **Inter-Service:** Core services communicate with the ML Layer via HTTP/REST or internal gRPC calls (if applicable) for low-latency inference.
* **External:** The system fetches data from external APIs (OpenWeather, AQICN, IMD) via scheduled cron jobs or event-driven triggers.
