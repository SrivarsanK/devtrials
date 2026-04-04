![alt text](image.png)# RideSuraksha — Technical Design Document

> **Version**: 1.0  
> **Last Updated**: March 2026  
> **Project**: Guidewire DEVTrails 2026 Hackathon

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WA[Worker PWA<br/>Next.js + React]
        PP[Platform Portal<br/>Swiggy/Zomato]
        ID[Insurer Dashboard<br/>Next.js + React]
    end
    
    subgraph "API Gateway"
        API[Node.js + Express<br/>REST API]
        WS[Socket.io<br/>Real-time Events]
    end
    
    subgraph "Core Services"
        PS[Policy Service]
        CS[Claims Service]
        TS[Trigger Service]
        FDS[Fraud Detection]
        PMS[Premium Service]
    end
    
    subgraph "ML Layer"
        MLA[FastAPI ML Service]
        XGB[XGBoost<br/>Premium Model]
        ISO[Isolation Forest<br/>Fraud Model]
        LSTM[LSTM<br/>Reserve Forecast]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL<br/>+TimescaleDB)]
        RD[(Redis<br/>Cache)]
    end
    
    subgraph "External APIs"
        OWM[OpenWeatherMap]
        IMD[IMD API]
        CPCB[CPCB API]
        GMAP[Google Maps]
        RPY[Razorpay]
    end
    
    WA --> API
    PP --> API
    ID --> API
    ID --> WS
    
    API --> PS
    API --> CS
    API --> TS
    API --> FDS
    API --> PMS
    
    PS --> PG
    CS --> PG
    TS --> PG
    FDS --> RD
    PMS --> MLA
    
    CS --> FDS
    CS --> RPY
    FDS --> MLA
    
    MLA --> XGB
    MLA --> ISO
    MLA --> LSTM
    
    TS --> OWM
    TS --> IMD
    TS --> CPCB
    TS --> GMAP
    
    TS --> WS
```


### 1.2 Technology Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, TypeScript, TailwindCSS, shadcn/ui, Zustand, Recharts, D3.js, Leaflet.js |
| **Backend** | Node.js, Express, Socket.io, Node-cron, JWT, bcrypt |
| **Database** | PostgreSQL, TimescaleDB, Redis |
| **ML/AI** | Python, FastAPI, scikit-learn, XGBoost, TensorFlow, Pandas, NumPy, Isolation Forest, LSTM |
| **External APIs** | IMD API, OpenWeatherMap, CPCB API, Google Maps Traffic API, Razorpay |
| **Infrastructure** | Docker, GitHub Actions, Vercel, Render |

---

## 2. System Components

### 2.1 Worker PWA (Progressive Web App)

**Purpose**: Mobile-optimized interface for delivery workers to enroll, manage coverage, and view claims.

**Key Features**:
- Partner ID-based registration
- Plan selection and premium management
- Coverage status dashboard
- Claims history viewing
- Tamil language support
- Offline capability for status viewing

**Technical Implementation**:
- Built with Next.js App Router
- Responsive mobile-first design
- PWA manifest for home screen installation
- Service worker for offline functionality
- State management with Zustand
- API communication via fetch with retry logic

**Routes**:
```
/                    → Landing page with enrollment CTA
/enroll              → Worker registration flow
/dashboard           → Coverage status and claims history
/plans               → Plan comparison and selection
/profile             → Worker profile and settings
```

---

### 2.2 Platform Portal (Swiggy/Zomato Integration)

**Purpose**: Integration layer between RideSuraksha and delivery platforms for data exchange and premium collection.

**Key Responsibilities**:
- Worker authentication via platform Partner ID
- GPS location data streaming
- Order flow monitoring
- Weekly premium deduction coordination
- RideSuraksha banner display in partner app

**API Endpoints** (Mocked for Hackathon):
```
GET  /api/platform/worker/:partnerId/profile
GET  /api/platform/worker/:partnerId/earnings
GET  /api/platform/worker/:partnerId/location
GET  /api/platform/worker/:partnerId/orders
POST /api/platform/deduction
```

---

### 2.3 Insurer Dashboard

**Purpose**: Desktop-optimized interface for insurance company administrators to monitor operations, manage reserves, and review fraud cases.

**Key Features**:
- Real-time trigger status monitoring
- Reserve health tracking with GREEN/AMBER/RED status
- Active policy management
- Claims review queue
- Fraud detection alerts
- Predictive analytics and forecasting
- Interactive zone risk maps
- Loss ratio reporting

**Technical Implementation**:
- Next.js with Server Components for data-heavy views
- Client Components for real-time Socket.io updates
- Recharts + D3.js for data visualization
- Leaflet.js for interactive maps
- Role-based access control (admin, operations, analyst)

**Routes**:
```
/insurer                    → Dashboard home
/insurer/policies           → Active policies management
/insurer/claims             → Claims review queue
/insurer/triggers           → Live trigger monitoring
/insurer/fraud              → Fraud detection panel
/insurer/reserves           → Reserve health monitoring
/insurer/analytics          → Predictive analytics
/insurer/zones              → Zone risk map
```

---

## 3. Core Service Design

### 3.1 Policy Service

**Responsibilities**:
- Create, read, update, delete policies
- Calculate weekly premiums with zone risk factors
- Manage policy lifecycle (active, paused, expired)
- Handle auto-renewal logic
- Track monthly event cap per worker

**API Endpoints**:
```
POST   /api/policies              → Create new policy
GET    /api/policies/:id          → Get policy details
PATCH  /api/policies/:id          → Update policy
DELETE /api/policies/:id          → Cancel policy
GET    /api/policies/worker/:id   → Get worker's active policy
POST   /api/policies/:id/renew    → Process weekly renewal
```

**Database Schema**:
```sql
CREATE TABLE policies (
  id UUID PRIMARY KEY,
  worker_id UUID REFERENCES workers(id),
  plan_tier VARCHAR(10) CHECK (plan_tier IN ('lite', 'plus', 'max')),
  weekly_premium DECIMAL(10,2),
  coverage_rate DECIMAL(3,2),
  monthly_event_cap INTEGER,
  payout_speed VARCHAR(10),
  zone_risk_factor DECIMAL(3,2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.2 Trigger Monitoring Service

**Responsibilities**:
- Poll external weather/AQI/traffic APIs every 5 minutes
- Detect threshold crossings for all parametric triggers
- Match trigger events to affected zones
- Identify eligible workers in affected zones
- Initiate claims processing pipeline
- Stream real-time trigger alerts to insurer dashboard

**Trigger Polling Architecture**:

```mermaid
sequenceDiagram
    participant Cron as Node-cron
    participant TS as Trigger Service
    participant OWM as OpenWeatherMap
    participant IMD as IMD API
    participant CPCB as CPCB API
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant CS as Claims Service
    
    Cron->>TS: Every 5 minutes
    TS->>OWM: Fetch rainfall data
    OWM-->>TS: Rainfall by zone
    TS->>IMD: Fetch flood alerts
    IMD-->>TS: Alert status
    TS->>CPCB: Fetch AQI data
    CPCB-->>TS: AQI by city
    
    TS->>TS: Evaluate thresholds
    
    alt Threshold Crossed
        TS->>Redis: Check if already processed
        Redis-->>TS: Not processed
        TS->>DB: Log trigger event
        TS->>TS: Identify affected zones
        TS->>DB: Query active workers in zones
        TS->>CS: Initiate claims for eligible workers
        TS->>Redis: Mark as processed
    end
```

**Trigger Definitions**:

| Trigger | Threshold | Data Source | Polling Interval |
|---|---|---|---|
| Heavy Rainfall | >50mm in 3hrs | OpenWeatherMap | 5 min |
| Air Quality Crisis | AQI >300 sustained 4hrs | CPCB API | 5 min |
| Flood Zone Alert | Official flood alert | IMD API | 5 min |
| Civil Disruption | Section 144 declared | Mock JSON feed | 10 min |
| Extreme Heat | Feels-like >45°C, 3hrs | OpenWeatherMap | 5 min |

**Database Schema**:
```sql
CREATE TABLE trigger_events (
  id UUID PRIMARY KEY,
  trigger_type VARCHAR(50),
  zone_id VARCHAR(50),
  timestamp TIMESTAMPTZ,
  data_source VARCHAR(100),
  threshold_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  affected_worker_count INTEGER,
  status VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TimescaleDB hypertable for efficient time-series queries
SELECT create_hypertable('trigger_events', 'timestamp');
```

---

### 3.3 Claims Processing Service

**Responsibilities**:
- Receive trigger-initiated claim requests
- Execute three-layer eligibility verification
- Calculate payout amount using formula
- Execute fraud detection scoring
- Route claims based on fraud score
- Process UPI payouts via Razorpay
- Send SMS notifications to workers
- Update policy event cap counters

**Claims Processing Flow**:

```mermaid
flowchart TD
    Start[Trigger Event Detected] --> Identify[Identify Affected Workers]
    Identify --> Loop{For Each Worker}
    
    Loop --> E1[Eligibility Check 1:<br/>Worker logged in?]
    E1 -->|No| Reject1[Reject: Not Active]
    E1 -->|Yes| E2[Eligibility Check 2:<br/>GPS in zone?]
    
    E2 -->|No| Reject2[Reject: Wrong Location]
    E2 -->|Yes| E3[Eligibility Check 3:<br/>Waiting period passed?]
    
    E3 -->|No| Reject3[Reject: Waiting Period]
    E3 -->|Yes| E4[Eligibility Check 4:<br/>Monthly cap not exceeded?]
    
    E4 -->|No| Reject4[Reject: Cap Reached]
    E4 -->|Yes| Calc[Calculate Payout:<br/>BHE × DH × PHM × CR × ZF]
    
    Calc --> Fraud[Fraud Detection:<br/>Score 0.0-1.0]
    
    Fraud --> Score{Fraud Score?}
    Score -->|0.0-0.3| Auto[Auto-Approve]
    Score -->|0.3-0.6| Review[Approve + Flag]
    Score -->|0.6-0.8| Hold[24hr Hold]
    Score -->|0.8-1.0| Deny[Deny Claim]
    
    Auto --> Payout[Process UPI Payout]
    Review --> Payout
    Hold --> Manual[Manual Review Queue]
    
    Payout --> SMS[Send SMS Notification]
    SMS --> Update[Update Event Cap Counter]
    Update --> Log[Log to Database]
    
    Reject1 --> Log
    Reject2 --> Log
    Reject3 --> Log
    Reject4 --> Log
    Deny --> Log
    
    Log --> Loop
```


**API Endpoints**:
```
POST /api/claims/initiate        → Trigger-initiated claim creation
GET  /api/claims/:id             → Get claim details
GET  /api/claims/worker/:id      → Get worker's claim history
PATCH /api/claims/:id/approve    → Manual claim approval
PATCH /api/claims/:id/deny       → Manual claim denial
POST /api/claims/:id/payout      → Execute payout
```

**Database Schema**:
```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY,
  worker_id UUID REFERENCES workers(id),
  policy_id UUID REFERENCES policies(id),
  trigger_event_id UUID REFERENCES trigger_events(id),
  trigger_type VARCHAR(50),
  trigger_time TIMESTAMPTZ,
  zone_id VARCHAR(50),
  disrupted_hours DECIMAL(4,2),
  peak_hour_multiplier DECIMAL(3,2),
  baseline_hourly_earning DECIMAL(10,2),
  coverage_rate DECIMAL(3,2),
  zone_factor DECIMAL(3,2),
  calculated_payout DECIMAL(10,2),
  fraud_score DECIMAL(3,2),
  eligibility_status VARCHAR(20),
  approval_status VARCHAR(30),
  payout_status VARCHAR(20),
  payout_time TIMESTAMPTZ,
  transaction_id VARCHAR(100),
  denial_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_claims_worker ON claims(worker_id);
CREATE INDEX idx_claims_status ON claims(approval_status, payout_status);
CREATE INDEX idx_claims_trigger_time ON claims(trigger_time);
```

---

### 3.4 Fraud Detection Service

**Responsibilities**:
- Score claims using ML model (Isolation Forest)
- Execute rule-based fraud checks
- Detect GPS spoofing attempts
- Perform peer cluster validation
- Flag suspicious patterns for review
- Generate weekly fraud reports

**Fraud Detection Architecture**:

```mermaid
flowchart LR
    Claim[New Claim] --> L1[Layer 1:<br/>Eligibility Gate]
    
    L1 --> L1C1{Logged in<br/>at trigger?}
    L1C1 -->|No| Reject1[Reject]
    L1C1 -->|Yes| L1C2{GPS in<br/>zone?}
    L1C2 -->|No| Reject2[Reject]
    L1C2 -->|Yes| L1C3{Waiting<br/>period?}
    L1C3 -->|No| Reject3[Reject]
    L1C3 -->|Yes| L1C4{Monthly<br/>cap OK?}
    L1C4 -->|No| Reject4[Reject]
    
    L1C4 -->|Yes| L2[Layer 2:<br/>Behavioral Analysis]
    
    L2 --> GPS[GPS Consistency<br/>Check]
    L2 --> Motion[Accelerometer<br/>Validation]
    L2 --> Peer[Peer Cluster<br/>Analysis]
    L2 --> Order[Order Rate<br/>Collapse Check]
    
    GPS --> ML[ML Model:<br/>Isolation Forest]
    Motion --> ML
    Peer --> ML
    Order --> ML
    
    ML --> Score{Fraud Score}
    Score -->|0.0-0.3| Auto[Auto-Approve]
    Score -->|0.3-0.6| Flag[Approve + Flag]
    Score -->|0.6-0.8| Hold[Hold 24hr]
    Score -->|0.8-1.0| Deny[Deny]
```


**Fraud Detection Signals**:

| Signal | Data Source | Detection Method | Weight |
|---|---|---|---|
| GPS Consistency | Platform GPS logs | Path analysis vs. expected delivery behavior | High |
| Motion Sensor | Device accelerometer | Cross-validation (spoofed GPS shows movement but stationary phone) | High |
| Cell Tower Match | Network metadata | GPS coordinates vs. nearest tower triangulation | High |
| Peer Cluster | All workers in zone | >80% of zone workers show same disruption pattern | Very High |
| Order Rate Collapse | Platform order data | Acceptance rate during disruption should be ~0 | Medium |

**API Endpoints**:
```
POST /api/fraud/score            → Calculate fraud score for claim
GET  /api/fraud/flagged          → Get flagged accounts
GET  /api/fraud/report/weekly    → Generate weekly fraud report
POST /api/fraud/investigate      → Mark account for investigation
```

---

### 3.5 Premium Calculation Service

**Responsibilities**:
- Calculate initial premium based on worker profile and zone
- Execute weekly dynamic pricing adjustments
- Interface with ML premium model (XGBoost)
- Apply zone risk multipliers
- Handle premium adjustment notifications

**Premium Calculation Flow**:

```mermaid
flowchart TD
    Start[New Enrollment / Weekly Recalc] --> Fetch[Fetch Worker Data]
    Fetch --> BHE[Calculate BHE:<br/>4-week rolling avg]
    BHE --> Zone[Determine Primary Zone]
    Zone --> Risk[Get Zone Risk Score]
    
    Risk --> ML[ML Model Input:<br/>XGBoost]
    
    ML --> Features[Feature Vector:<br/>- Worker BHE<br/>- Zone history<br/>- Season phase<br/>- Weather forecast<br/>- Order volume baseline]
    
    Features --> Predict[Model Prediction:<br/>Risk Multiplier 0.80x-1.20x]
    
    Predict --> Base[Base Premium by Tier:<br/>Lite ₹79 / Plus ₹119 / Max ₹159]
    
    Base --> Apply[Apply Multipliers:<br/>Zone × AI Adjustment]
    
    Apply --> Final[Final Weekly Premium]
    Final --> Notify[Notify Worker if Changed]
```

**API Endpoints**:
```
POST /api/premium/calculate      → Calculate premium for worker
POST /api/premium/adjust/weekly  → Run weekly adjustment for all policies
GET  /api/premium/forecast       → Get next week's predicted adjustment
```

---

## 4. ML/AI Service Design

### 4.1 ML Service Architecture

```mermaid
graph TB
    subgraph "FastAPI ML Service"
        API[FastAPI Router]
        
        subgraph "Premium Module"
            PM[Premium Calculator]
            XGB[XGBoost Model]
            PF[Feature Pipeline]
        end
        
        subgraph "Fraud Module"
            FM[Fraud Scorer]
            ISO[Isolation Forest]
            FF[Feature Extractor]
        end
        
        subgraph "Forecast Module"
            RM[Reserve Forecaster]
            LSTM[LSTM Model]
            RF[Time Series Pipeline]
        end
    end
    
    API --> PM
    API --> FM
    API --> RM
    
    PM --> PF
    PF --> XGB
    
    FM --> FF
    FF --> ISO
    
    RM --> RF
    RF --> LSTM
```


### 4.2 Dynamic Premium Model (XGBoost)

**Model Type**: Gradient Boosted Regressor

**Input Features** (15 features):
```python
# Worker-level features (5)
- baseline_hourly_earning: float
- active_hours_per_week: float
- platform_tenure_months: int
- delivery_completion_rate: float
- avg_orders_per_day: float

# Zone-level features (5)
- zone_disruption_frequency_3yr: float
- restaurant_cluster_density: int
- infrastructure_quality_index: float
- waterlogging_risk_score: float
- historical_claim_rate: float

# Environmental features (5)
- weather_forecast_confidence_72hr: float
- current_season_phase: categorical
- monsoon_intensity_index: float
- upcoming_event_risk: boolean
- day_of_week_order_baseline: float
```

**Output**: Risk multiplier (0.80 – 1.20)

**Training Data**:
- IMD historical weather records (2021-2025)
- OpenWeatherMap historical API data
- Mock order volume data calibrated to public research
- Simulated worker earning patterns

**Retraining Schedule**: Weekly, using previous week's actual trigger events vs predictions

**API Endpoint**:
```
POST /ml/premium/calculate
Request: { worker_features, zone_features, env_features }
Response: { risk_multiplier: 1.05, confidence: 0.87 }
```

---

### 4.3 Fraud Detection Model (Isolation Forest)

**Model Type**: Unsupervised anomaly detection

**Input Features** (12 features):
```python
# GPS features (4)
- gps_movement_variance: float
- gps_cluster_density: float
- cell_tower_distance: float
- location_history_consistency: float

# Behavioral features (4)
- order_acceptance_rate_during_disruption: float
- accelerometer_movement_detected: boolean
- peer_cluster_match_percentage: float
- restaurant_zone_pause_confirmed: boolean

# Historical features (4)
- claim_frequency_last_30_days: int
- signup_pause_resume_pattern_score: float
- referral_network_suspicious_flag: boolean
- device_fingerprint_duplicate_count: int
```

**Output**: Anomaly score (0.0 – 1.0)

**Score Interpretation**:
- 0.0 – 0.3: Normal behavior, auto-approve
- 0.3 – 0.6: Slightly anomalous, approve with background review
- 0.6 – 0.8: Suspicious, hold for manual review
- 0.8 – 1.0: Highly anomalous, deny claim

**Training Data**:
- Simulated genuine claims with realistic GPS variance
- Simulated fraud patterns (GPS clustering, spoofing, collusion)
- Labeled dataset with 80% genuine, 20% fraud

**API Endpoint**:
```
POST /ml/fraud/score
Request: { claim_id, gps_data, behavioral_data, historical_data }
Response: { fraud_score: 0.23, signals: {...}, recommendation: 'auto_approve' }
```

---

### 4.4 Reserve Forecasting Model (LSTM)

**Model Type**: Long Short-Term Memory time-series forecaster

**Input Features** (time series, 7-day lookback):
```python
# Weather forecast (per zone)
- rainfall_forecast_72hr: array[float]
- temperature_forecast_72hr: array[float]
- aqi_forecast_72hr: array[float]

# Historical patterns
- same_week_claim_count_prev_years: array[int]
- seasonal_disruption_index: float

# Current state
- active_policy_count_by_zone: int
- current_reserve_balance: float
- avg_payout_per_claim_last_30d: float
```

**Output** (per zone):
```python
{
  "zone_id": "chennai_tambaram",
  "predicted_claim_count_7d": 34,
  "predicted_payout_liability": 27200,
  "confidence_interval_lower": 21760,
  "confidence_interval_upper": 32640,
  "zone_risk_status": "AMBER"
}
```

**API Endpoint**:
```
GET /ml/reserve/forecast/:zone_id
Response: { predicted_claims, predicted_liability, confidence_interval, risk_status }
```

---

## 5. Database Design

### 5.1 Entity Relationship Diagram

```mermaid
erDiagram
    WORKERS ||--o{ POLICIES : has
    WORKERS ||--o{ CLAIMS : files
    POLICIES ||--o{ CLAIMS : covers
    TRIGGER_EVENTS ||--o{ CLAIMS : initiates
    ZONES ||--o{ WORKERS : operates_in
    ZONES ||--o{ TRIGGER_EVENTS : affects
    
    WORKERS {
        uuid id PK
        string partner_id UK
        string name
        string phone
        string language
        string upi_id
        string platform
        string primary_zone FK
        decimal baseline_hourly_earning
        timestamp enrollment_date
        string coverage_status
        timestamp created_at
    }
    
    POLICIES {
        uuid id PK
        uuid worker_id FK
        string plan_tier
        decimal weekly_premium
        decimal coverage_rate
        int monthly_event_cap
        string payout_speed
        decimal zone_risk_factor
        timestamp start_date
        timestamp end_date
        string status
    }
    
    CLAIMS {
        uuid id PK
        uuid worker_id FK
        uuid policy_id FK
        uuid trigger_event_id FK
        string trigger_type
        timestamp trigger_time
        decimal calculated_payout
        decimal fraud_score
        string approval_status
        string payout_status
        timestamp payout_time
    }
    
    TRIGGER_EVENTS {
        uuid id PK
        string trigger_type
        string zone_id FK
        timestamp timestamp
        decimal actual_value
        int affected_worker_count
        string status
    }
    
    ZONES {
        string id PK
        string city
        string name
        decimal risk_score
        decimal risk_multiplier
        jsonb boundary_polygon
    }
```


### 5.2 TimescaleDB Hypertables

For efficient time-series queries on trigger events and claims:

```sql
-- Convert trigger_events to hypertable
SELECT create_hypertable('trigger_events', 'timestamp');

-- Create continuous aggregate for hourly trigger summaries
CREATE MATERIALIZED VIEW trigger_events_hourly
WITH (timescaledb.continuous) AS
SELECT 
  time_bucket('1 hour', timestamp) AS hour,
  trigger_type,
  zone_id,
  COUNT(*) as event_count,
  AVG(actual_value) as avg_value,
  MAX(actual_value) as max_value
FROM trigger_events
GROUP BY hour, trigger_type, zone_id;

-- Refresh policy
SELECT add_continuous_aggregate_policy('trigger_events_hourly',
  start_offset => INTERVAL '3 hours',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
```

---

## 6. API Design

### 6.1 REST API Endpoints

#### Authentication
```
POST /api/auth/worker/login      → Worker login via Partner ID
POST /api/auth/insurer/login     → Insurer admin login
POST /api/auth/refresh           → Refresh JWT token
POST /api/auth/logout            → Logout and invalidate token
```

#### Workers
```
POST /api/workers                → Create worker profile
GET  /api/workers/:id            → Get worker details
PATCH /api/workers/:id           → Update worker profile
GET  /api/workers/:id/earnings   → Get earning history
```

#### Policies
```
POST /api/policies               → Create new policy
GET  /api/policies/:id           → Get policy details
PATCH /api/policies/:id          → Update policy
DELETE /api/policies/:id         → Cancel policy
POST /api/policies/:id/pause     → Pause coverage
POST /api/policies/:id/resume    → Resume coverage
```

#### Claims
```
POST /api/claims/initiate        → Initiate claim (trigger-based)
GET  /api/claims/:id             → Get claim details
GET  /api/claims/worker/:id      → Get worker's claims
PATCH /api/claims/:id/review     → Manual review decision
GET  /api/claims/pending         → Get pending review queue
```

#### Triggers
```
GET /api/triggers/active         → Get active trigger events
GET /api/triggers/history        → Get historical triggers
GET /api/triggers/zones/:id      → Get zone-specific triggers
```

#### Analytics (Insurer)
```
GET /api/analytics/dashboard     → Dashboard summary stats
GET /api/analytics/loss-ratio    → Loss ratio by period
GET /api/analytics/reserves      → Reserve health metrics
GET /api/analytics/forecast      → 72-hour claims forecast
```

### 6.2 WebSocket Events (Socket.io)

**Server → Client Events**:
```javascript
// Real-time trigger alerts
socket.emit('trigger:detected', {
  triggerType: 'heavy_rainfall',
  zoneId: 'chennai_tambaram',
  actualValue: 52.3,
  affectedWorkers: 847,
  timestamp: '2026-03-20T19:22:00Z'
});

// Claim status updates
socket.emit('claim:approved', {
  claimId: 'uuid',
  workerId: 'uuid',
  payout: 298,
  status: 'processing'
});

// Reserve status changes
socket.emit('reserve:status_change', {
  status: 'AMBER',
  reserveBalance: 2240000,
  coverageRatio: 2.1
});
```

**Client → Server Events**:
```javascript
// Subscribe to zone updates
socket.emit('subscribe:zone', { zoneId: 'chennai_tambaram' });

// Subscribe to worker updates
socket.emit('subscribe:worker', { workerId: 'uuid' });
```

---

## 7. Workflow Designs

### 7.1 Worker Enrollment Workflow

```mermaid
sequenceDiagram
    participant W as Worker
    participant PWA as Worker PWA
    participant API as Backend API
    participant Platform as Platform API
    participant ML as ML Service
    participant DB as Database
    
    W->>PWA: Opens RideSuraksha link
    PWA->>W: Show Tamil language welcome
    W->>PWA: Enter Partner ID
    PWA->>API: POST /api/workers/enroll
    API->>Platform: Fetch earning history
    Platform-->>API: 4-week earnings data
    API->>API: Calculate BHE
    API->>API: Determine primary zone
    API->>ML: Calculate risk profile
    ML-->>API: Zone risk score + multiplier
    API->>API: Generate plan recommendations
    API-->>PWA: Plans with premiums
    PWA->>W: Show 3 plan options
    W->>PWA: Select Guard Plus
    PWA->>W: Enter UPI ID
    W->>PWA: Confirm enrollment
    PWA->>API: POST /api/policies
    API->>DB: Create policy (status: waiting)
    API->>DB: Set waiting_period_end = now + 3 days
    API-->>PWA: Enrollment success
    PWA->>W: SMS: "3-day waiting period begins"
    
    Note over API,DB: 3 days later (automated)
    API->>DB: Update policy status = active
    API->>W: SMS: "Coverage active! ₹119/week"
```


### 7.2 Trigger Detection & Claims Processing Workflow

```mermaid
sequenceDiagram
    participant Cron as Node-cron
    participant TS as Trigger Service
    participant API as External APIs
    participant Redis as Redis
    participant DB as Database
    participant CS as Claims Service
    participant FD as Fraud Detection
    participant ML as ML Service
    participant Pay as Razorpay
    participant W as Worker
    
    Cron->>TS: Every 5 minutes
    TS->>API: Poll weather/AQI data
    API-->>TS: Current readings
    
    TS->>TS: Evaluate thresholds
    
    alt Threshold Crossed
        TS->>Redis: Check deduplication
        Redis-->>TS: Not processed
        
        TS->>DB: Log trigger event
        TS->>DB: Query active workers in zone
        DB-->>TS: List of eligible workers
        
        loop For each worker
            TS->>CS: Initiate claim
            
            CS->>CS: Eligibility Check 1: Logged in?
            CS->>CS: Eligibility Check 2: GPS in zone?
            CS->>CS: Eligibility Check 3: Waiting period?
            CS->>CS: Eligibility Check 4: Monthly cap?
            
            alt All checks passed
                CS->>CS: Calculate payout (BHE × DH × PHM × CR × ZF)
                CS->>FD: Request fraud score
                FD->>ML: POST /ml/fraud/score
                ML-->>FD: Fraud score 0.23
                FD-->>CS: Score + recommendation
                
                alt Score < 0.3 (Auto-approve)
                    CS->>DB: Update claim status = approved
                    CS->>Pay: Process UPI payout
                    Pay-->>CS: Transaction ID
                    CS->>DB: Update payout_status = completed
                    CS->>W: SMS: "₹298 credited. Stay safe."
                    CS->>DB: Increment monthly_event_count
                else Score 0.3-0.6 (Approve + Flag)
                    CS->>DB: Update claim status = approved_flagged
                    CS->>Pay: Process UPI payout
                    CS->>W: SMS: "₹298 credited. Stay safe."
                else Score > 0.6 (Hold/Deny)
                    CS->>DB: Update claim status = pending_review
                    CS->>W: SMS: "Claim under review. 24hr update."
                end
            else Eligibility failed
                CS->>DB: Update claim status = denied
                CS->>W: SMS: "Claim ineligible. [Reason]"
            end
        end
        
        TS->>Redis: Mark trigger as processed
    end
```


### 7.3 Weekly Premium Renewal Workflow

```mermaid
sequenceDiagram
    participant Cron as Node-cron
    participant PS as Premium Service
    participant ML as ML Service
    participant DB as Database
    participant Platform as Platform API
    participant W as Worker
    
    Note over Cron: Every Friday 8:00 PM
    Cron->>PS: Run weekly adjustment
    PS->>DB: Get all active policies
    
    loop For each policy
        PS->>DB: Get worker data
        PS->>ML: POST /ml/premium/calculate
        ML-->>PS: New risk multiplier
        PS->>PS: Calculate adjusted premium
        
        alt Premium changed
            PS->>DB: Update policy.weekly_premium
            PS->>W: SMS: "Next week ₹143 (high risk forecast)"
        end
    end
    
    Note over Cron: Every Monday 6:00 AM
    Cron->>PS: Process renewals
    PS->>DB: Get all active policies
    
    loop For each policy
        PS->>Platform: Deduct premium from payout
        
        alt Deduction successful
            Platform-->>PS: Deduction confirmed
            PS->>DB: Log premium transaction
            PS->>DB: Reset monthly_event_count (if new month)
            PS->>W: SMS: "₹119 deducted. Coverage active."
        else Insufficient balance
            Platform-->>PS: Deduction failed
            PS->>DB: Update policy status = paused
            PS->>W: SMS: "Coverage paused. Insufficient balance."
        end
    end
```

---

### 7.4 Reserve Monitoring & Circuit Breaker Workflow

```mermaid
flowchart TD
    Start[Reserve Monitoring Service] --> Calc[Calculate Current Metrics]
    
    Calc --> Reserve[Reserve Balance: ₹2.24Cr]
    Calc --> Liability[Active Liability: ₹1.06Cr]
    Calc --> Ratio[Coverage Ratio: 2.1x]
    
    Ratio --> Status{Ratio Check}
    
    Status -->|> 3.0x| Green[🟢 GREEN Status]
    Status -->|2.0x - 3.0x| Amber[🟡 AMBER Status]
    Status -->|< 2.0x| Red[🔴 RED Status]
    
    Green --> G1[Normal Operations]
    G1 --> G2[New Sign-ups: Open]
    G2 --> G3[Reinsurance: Standby]
    
    Amber --> A1[Caution Mode]
    A1 --> A2[New Sign-ups: 50% Throttle]
    A2 --> A3[Alert Reinsurance Partner]
    A3 --> A4[Notify Management]
    
    Red --> R1[Emergency Mode]
    R1 --> R2[New Sign-ups: PAUSED]
    R2 --> R3[Initiate Reinsurance Claim]
    R3 --> R4[Emergency Management Alert]
    R4 --> R5[Zone-by-Zone Review]
```

---

## 8. Security Design

### 8.1 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API
    participant DB as Database
    participant JWT as JWT Service
    
    U->>FE: Enter credentials
    FE->>API: POST /api/auth/login
    API->>DB: Query user by partner_id/email
    DB-->>API: User record
    API->>API: bcrypt.compare(password, hash)
    
    alt Valid credentials
        API->>JWT: Generate access token (15min)
        API->>JWT: Generate refresh token (7d)
        JWT-->>API: Tokens
        API->>DB: Store refresh token
        API-->>FE: { accessToken, refreshToken, user }
        FE->>FE: Store tokens in httpOnly cookies
        FE-->>U: Redirect to dashboard
    else Invalid credentials
        API-->>FE: 401 Unauthorized
        FE-->>U: Show error message
    end
```

### 8.2 Role-Based Access Control

```typescript
enum Role {
  WORKER = 'worker',
  INSURER_ADMIN = 'insurer_admin',
  INSURER_OPERATIONS = 'insurer_operations',
  INSURER_ANALYST = 'insurer_analyst',
  PLATFORM_ADMIN = 'platform_admin'
}

const permissions = {
  worker: [
    'read:own_policy',
    'read:own_claims',
    'update:own_profile',
    'create:policy'
  ],
  insurer_admin: [
    'read:all_policies',
    'read:all_claims',
    'update:claims',
    'read:analytics',
    'manage:zones',
    'manage:reserves'
  ],
  insurer_operations: [
    'read:all_claims',
    'update:claims',
    'read:fraud_flags'
  ],
  insurer_analyst: [
    'read:all_policies',
    'read:all_claims',
    'read:analytics'
  ]
};
```

### 8.3 Data Encryption

- **At Rest**: PostgreSQL transparent data encryption for sensitive fields
- **In Transit**: TLS 1.3 for all API communication
- **Sensitive Fields**: UPI IDs, phone numbers encrypted with AES-256
- **Password Storage**: bcrypt with salt rounds = 12

---

## 9. Real-Time Communication Design

### 9.1 Socket.io Architecture

```mermaid
graph LR
    subgraph "Insurer Clients"
        C1[Dashboard 1]
        C2[Dashboard 2]
        C3[Dashboard 3]
    end
    
    subgraph "Socket.io Server"
        IO[Socket.io Instance]
        Redis[Redis Adapter]
    end
    
    subgraph "Event Sources"
        TS[Trigger Service]
        CS[Claims Service]
        RS[Reserve Service]
    end
    
    C1 --> IO
    C2 --> IO
    C3 --> IO
    
    IO <--> Redis
    
    TS --> IO
    CS --> IO
    RS --> IO
    
    IO -->|Broadcast| C1
    IO -->|Broadcast| C2
    IO -->|Broadcast| C3
```

**Event Types**:
- `trigger:detected` - New trigger event detected
- `claim:initiated` - Claim auto-initiated
- `claim:approved` - Claim approved
- `claim:denied` - Claim denied
- `payout:completed` - Payout successful
- `reserve:status_change` - Reserve status changed (GREEN/AMBER/RED)
- `fraud:alert` - High fraud score detected

---

## 10. Payout Calculation Engine

### 10.1 Payout Formula Implementation

```typescript
interface PayoutCalculation {
  baselineHourlyEarning: number;  // BHE
  disruptedHours: number;          // DH
  peakHourMultiplier: number;      // PHM
  coverageRate: number;            // CR
  zoneFactor: number;              // ZF
}

function calculatePayout(params: PayoutCalculation): number {
  const {
    baselineHourlyEarning,
    disruptedHours,
    peakHourMultiplier,
    coverageRate,
    zoneFactor
  } = params;
  
  const payout = 
    baselineHourlyEarning *
    disruptedHours *
    peakHourMultiplier *
    coverageRate *
    zoneFactor;
  
  return Math.round(payout); // Round to nearest rupee
}

// Example usage
const payout = calculatePayout({
  baselineHourlyEarning: 85,
  disruptedHours: 2.5,
  peakHourMultiplier: 2.0,  // Dinner rush
  coverageRate: 0.70,        // Guard Plus
  zoneFactor: 1.0            // Base zone
});
// Result: ₹298
```


### 10.2 Peak Hour Multiplier Logic

```typescript
function getPeakHourMultiplier(timestamp: Date): number {
  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // 6:30 PM – 10:30 PM (1110 - 1350 minutes) → Dinner rush
  if (timeInMinutes >= 1110 && timeInMinutes < 1350) {
    return 2.0;
  }
  
  // 11:30 AM – 2:30 PM (690 - 870 minutes) → Lunch rush
  if (timeInMinutes >= 690 && timeInMinutes < 870) {
    return 1.5;
  }
  
  // 2:30 PM – 6:30 PM (870 - 1110 minutes) → Afternoon lull
  if (timeInMinutes >= 870 && timeInMinutes < 1110) {
    return 0.7;
  }
  
  // 10:30 PM – 11:30 AM (all other times) → Off-peak
  return 0.5;
}
```

### 10.3 Disrupted Hours Calculation

```typescript
function calculateDisruptedHours(
  triggerStartTime: Date,
  triggerEndTime: Date,
  workerLoginTime: Date,
  workerLogoutTime: Date
): number {
  // Find overlap between trigger window and worker active window
  const disruptionStart = Math.max(
    triggerStartTime.getTime(),
    workerLoginTime.getTime()
  );
  
  const disruptionEnd = Math.min(
    triggerEndTime.getTime(),
    workerLogoutTime.getTime()
  );
  
  if (disruptionEnd <= disruptionStart) {
    return 0; // No overlap
  }
  
  const disruptedMilliseconds = disruptionEnd - disruptionStart;
  const disruptedHours = disruptedMilliseconds / (1000 * 60 * 60);
  
  return Math.round(disruptedHours * 10) / 10; // Round to 1 decimal
}
```

---

## 11. Frontend Design

### 11.1 Worker PWA Component Architecture

```mermaid
graph TD
    App[App Root] --> Layout[Layout Component]
    
    Layout --> Nav[Navigation]
    Layout --> Content[Page Content]
    
    Content --> Home[Home Page]
    Content --> Enroll[Enrollment Flow]
    Content --> Dashboard[Dashboard]
    Content --> Claims[Claims History]
    Content --> Profile[Profile]
    
    Enroll --> Step1[Step 1: Partner ID]
    Enroll --> Step2[Step 2: Plan Selection]
    Enroll --> Step3[Step 3: UPI Link]
    Enroll --> Step4[Step 4: Confirmation]
    
    Dashboard --> Status[Coverage Status Card]
    Dashboard --> EventCap[Event Cap Indicator]
    Dashboard --> NextPremium[Next Premium Info]
    
    Claims --> ClaimList[Claims List]
    Claims --> ClaimDetail[Claim Detail Modal]
```

**State Management (Zustand)**:
```typescript
interface AppState {
  // Auth
  user: Worker | null;
  isAuthenticated: boolean;
  
  // Policy
  activePolicy: Policy | null;
  
  // Claims
  claims: Claim[];
  
  // UI
  language: 'tamil' | 'english';
  isLoading: boolean;
  
  // Actions
  login: (partnerId: string) => Promise<void>;
  logout: () => void;
  fetchPolicy: () => Promise<void>;
  fetchClaims: () => Promise<void>;
  setLanguage: (lang: string) => void;
}
```

---

### 11.2 Insurer Dashboard Component Architecture

```mermaid
graph TD
    App[Insurer App] --> Auth[Auth Guard]
    Auth --> Layout[Dashboard Layout]
    
    Layout --> Sidebar[Sidebar Navigation]
    Layout --> Main[Main Content Area]
    
    Main --> Overview[Overview Dashboard]
    Main --> Policies[Policies Management]
    Main --> Claims[Claims Review]
    Main --> Triggers[Trigger Monitoring]
    Main --> Fraud[Fraud Detection]
    Main --> Reserves[Reserve Management]
    Main --> Analytics[Analytics]
    Main --> Zones[Zone Risk Map]
    
    Overview --> LiveStatus[Live Status Panel]
    Overview --> ReserveHealth[Reserve Health Widget]
    Overview --> ActivePolicies[Active Policies Count]
    Overview --> WeeklyClaims[Weekly Claims Summary]
    
    Triggers --> TriggerList[Active Triggers List]
    Triggers --> TriggerMap[Zone Trigger Map]
    Triggers --> TriggerHistory[Historical Triggers]
    
    Claims --> PendingQueue[Pending Review Queue]
    Claims --> ClaimDetail[Claim Detail View]
    Claims --> ApprovalActions[Approve/Deny Actions]
    
    Fraud --> FraudQueue[Flagged Claims]
    Fraud --> FraudPatterns[Pattern Analysis]
    Fraud --> GPSSpoofing[GPS Spoofing Alerts]
    
    Reserves --> ReserveChart[Reserve Balance Chart]
    Reserves --> ForecastPanel[72hr Forecast]
    Reserves --> CircuitBreaker[Circuit Breaker Controls]
    
    Zones --> InteractiveMap[Leaflet.js Map]
    Zones --> ZoneDetails[Zone Detail Panel]
```

---

## 12. Data Visualization Design

### 12.1 Reserve Health Chart (Recharts)

```typescript
interface ReserveDataPoint {
  date: string;
  reserveBalance: number;
  activeLiability: number;
  coverageRatio: number;
}

// Line chart showing reserve balance vs active liability over time
<LineChart data={reserveData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line type="monotone" dataKey="reserveBalance" stroke="#10b981" />
  <Line type="monotone" dataKey="activeLiability" stroke="#ef4444" />
  <ReferenceLine y={2.0} label="Min Coverage Ratio" stroke="#f59e0b" />
</LineChart>
```

### 12.2 Zone Risk Map (Leaflet.js)

```typescript
// Interactive map with color-coded zones
const zoneColors = {
  GREEN: '#10b981',
  AMBER: '#f59e0b',
  RED: '#ef4444'
};

zones.forEach(zone => {
  L.polygon(zone.boundaryPolygon, {
    color: zoneColors[zone.riskStatus],
    fillOpacity: 0.3
  })
  .bindPopup(`
    <strong>${zone.name}</strong><br/>
    Active Policies: ${zone.activePolicies}<br/>
    Risk Score: ${zone.riskScore}/10<br/>
    72hr Forecast: ${zone.predictedClaims} claims
  `)
  .addTo(map);
});
```

### 12.3 Loss Ratio Trend (D3.js)

```typescript
// Area chart showing loss ratio trend with target band
const svg = d3.select('#loss-ratio-chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Target band (60-65%)
svg.append('rect')
  .attr('y', yScale(65))
  .attr('height', yScale(60) - yScale(65))
  .attr('fill', '#10b981')
  .attr('opacity', 0.2);

// Actual loss ratio line
svg.append('path')
  .datum(lossRatioData)
  .attr('d', d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.lossRatio))
  )
  .attr('stroke', '#3b82f6')
  .attr('stroke-width', 2);
```

---

## 13. Background Jobs Design

### 13.1 Scheduled Jobs (Node-cron)

```typescript
import cron from 'node-cron';

// Trigger polling - Every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await triggerService.pollExternalAPIs();
  await triggerService.evaluateThresholds();
  await triggerService.initiateClaimsIfNeeded();
});

// Weekly premium adjustment - Every Friday 8:00 PM
cron.schedule('0 20 * * 5', async () => {
  await premiumService.runWeeklyAdjustment();
});

// Weekly renewal - Every Monday 6:00 AM
cron.schedule('0 6 * * 1', async () => {
  await policyService.processWeeklyRenewals();
});

// Reserve monitoring - Every hour
cron.schedule('0 * * * *', async () => {
  await reserveService.calculateReserveHealth();
  await reserveService.updateZoneRiskStatus();
});

// Fraud pattern analysis - Every day 2:00 AM
cron.schedule('0 2 * * *', async () => {
  await fraudService.analyzeHistoricalPatterns();
  await fraudService.generateDailyReport();
});
```

---

## 14. Error Handling & Resilience

### 14.1 API Retry Logic

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Retry on 5xx errors
      if (response.status >= 500 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### 14.2 External API Fallback Strategy

```mermaid
flowchart TD
    Start[Trigger Polling] --> Primary[Try Primary API:<br/>OpenWeatherMap]
    
    Primary -->|Success| Process[Process Data]
    Primary -->|Failure| Cache{Check Redis<br/>Cache}
    
    Cache -->|Hit| Cached[Use Cached Data<br/>+ Log Warning]
    Cache -->|Miss| Fallback[Try Fallback API:<br/>IMD]
    
    Fallback -->|Success| Process
    Fallback -->|Failure| Alert[Alert Admin<br/>+ Skip This Cycle]
    
    Process --> Store[Store in Redis<br/>TTL: 10 min]
    Cached --> Continue[Continue Processing]
    Store --> Continue
```


### 14.3 Payout Failure Handling

```mermaid
sequenceDiagram
    participant CS as Claims Service
    participant Pay as Razorpay
    participant Queue as Retry Queue
    participant DB as Database
    participant W as Worker
    
    CS->>Pay: Process UPI payout
    
    alt Payout Success
        Pay-->>CS: Transaction ID
        CS->>DB: Update payout_status = completed
        CS->>W: SMS: "₹298 credited"
    else Payout Failed
        Pay-->>CS: Error (insufficient balance, invalid UPI, etc.)
        CS->>DB: Update payout_status = failed
        CS->>Queue: Add to retry queue
        CS->>W: SMS: "Payout processing. Will retry."
        
        Note over Queue: Retry after 1 hour
        Queue->>CS: Retry payout
        CS->>Pay: Process UPI payout (retry)
        
        alt Retry Success
            Pay-->>CS: Transaction ID
            CS->>DB: Update payout_status = completed
            CS->>W: SMS: "₹298 credited"
        else Retry Failed (3x)
            CS->>DB: Update payout_status = manual_review
            CS->>W: SMS: "Payout issue. Support will contact."
        end
    end
```

---

## 15. Performance Optimization

### 15.1 Caching Strategy

```typescript
// Redis caching layers
const cacheConfig = {
  // Worker profile cache
  workerProfile: {
    key: (workerId) => `worker:${workerId}`,
    ttl: 3600 // 1 hour
  },
  
  // Active policy cache
  activePolicy: {
    key: (workerId) => `policy:active:${workerId}`,
    ttl: 1800 // 30 minutes
  },
  
  // Fraud score cache
  fraudScore: {
    key: (claimId) => `fraud:score:${claimId}`,
    ttl: 300 // 5 minutes
  },
  
  // Trigger event deduplication
  triggerDedup: {
    key: (triggerType, zoneId, timestamp) => 
      `trigger:${triggerType}:${zoneId}:${timestamp}`,
    ttl: 600 // 10 minutes
  },
  
  // Zone risk status
  zoneRisk: {
    key: (zoneId) => `zone:risk:${zoneId}`,
    ttl: 3600 // 1 hour
  }
};
```

### 15.2 Database Indexing Strategy

```sql
-- Workers table
CREATE INDEX idx_workers_partner_id ON workers(partner_id);
CREATE INDEX idx_workers_primary_zone ON workers(primary_zone);
CREATE INDEX idx_workers_coverage_status ON workers(coverage_status);

-- Policies table
CREATE INDEX idx_policies_worker_id ON policies(worker_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_end_date ON policies(end_date) WHERE status = 'active';

-- Claims table
CREATE INDEX idx_claims_worker_id ON claims(worker_id);
CREATE INDEX idx_claims_trigger_time ON claims(trigger_time);
CREATE INDEX idx_claims_approval_status ON claims(approval_status);
CREATE INDEX idx_claims_payout_status ON claims(payout_status);
CREATE INDEX idx_claims_fraud_score ON claims(fraud_score) WHERE fraud_score > 0.6;

-- Composite indexes for common queries
CREATE INDEX idx_claims_worker_month ON claims(worker_id, DATE_TRUNC('month', trigger_time));
CREATE INDEX idx_policies_zone_active ON policies(zone_risk_factor, status) WHERE status = 'active';
```

### 15.3 Query Optimization

```typescript
// Efficient query for monthly event cap check
async function getMonthlyEventCount(workerId: string): Promise<number> {
  const result = await db.query(`
    SELECT COUNT(*) as count
    FROM claims
    WHERE worker_id = $1
      AND approval_status IN ('approved', 'auto_approved')
      AND DATE_TRUNC('month', trigger_time) = DATE_TRUNC('month', NOW())
  `, [workerId]);
  
  return parseInt(result.rows[0].count);
}

// Efficient query for zone-level trigger matching
async function getActiveWorkersInZone(zoneId: string): Promise<Worker[]> {
  return await db.query(`
    SELECT w.*
    FROM workers w
    INNER JOIN policies p ON w.id = p.worker_id
    WHERE w.primary_zone = $1
      AND p.status = 'active'
      AND p.end_date > NOW()
  `, [zoneId]);
}
```

---

## 16. Monitoring & Observability

### 16.1 Logging Strategy

```typescript
// Structured logging with Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'RideSuraksha-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log levels by event type
const logLevels = {
  triggerDetected: 'info',
  claimInitiated: 'info',
  claimApproved: 'info',
  claimDenied: 'warn',
  payoutFailed: 'error',
  fraudDetected: 'warn',
  apiFailure: 'error',
  reserveStatusChange: 'warn'
};
```

### 16.2 Metrics Collection

```typescript
// Key metrics to track
interface SystemMetrics {
  // Performance
  apiResponseTime: Histogram;
  triggerPollingDuration: Histogram;
  claimProcessingDuration: Histogram;
  
  // Business
  activePoliciesCount: Gauge;
  claimsProcessedToday: Counter;
  totalPayoutsToday: Counter;
  currentLossRatio: Gauge;
  
  // Reliability
  apiErrorRate: Counter;
  payoutFailureRate: Counter;
  externalApiUptime: Gauge;
  
  // Fraud
  fraudScoreDistribution: Histogram;
  claimsDeniedCount: Counter;
  gpsSpoofingAttempts: Counter;
}
```

---

## 17. Deployment Architecture

### 17.1 Production Deployment

```mermaid
graph TB
    subgraph "Vercel Edge Network"
        FE1[Next.js Frontend<br/>Worker PWA]
        FE2[Next.js Frontend<br/>Insurer Dashboard]
    end
    
    subgraph "Render"
        API[Node.js API<br/>Express + Socket.io]
        ML[FastAPI ML Service<br/>Python]
    end
    
    subgraph "Managed Services"
        PG[(PostgreSQL<br/>+TimescaleDB)]
        RD[(Redis)]
    end
    
    subgraph "External"
        OWM[OpenWeatherMap]
        CPCB[CPCB API]
        RPY[Razorpay]
    end
    
    FE1 --> API
    FE2 --> API
    API --> ML
    API --> PG
    API --> RD
    API --> OWM
    API --> CPCB
    API --> RPY
```

### 17.2 Local Development (Docker Compose)

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    volumes:
      - ./frontend:/app
    
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/RideSuraksha
      - REDIS_URL=redis://redis:6379
      - ML_API_URL=http://ml-service:8000
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
  
  ml-service:
    build: ./ml
    ports:
      - "8000:8000"
    volumes:
      - ./ml:/app
  
  db:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=RideSuraksha
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

---

## 18. Testing Strategy

### 18.1 Unit Testing

```typescript
// Example: Payout calculation unit test
describe('PayoutCalculation', () => {
  it('should calculate correct payout for dinner rush disruption', () => {
    const result = calculatePayout({
      baselineHourlyEarning: 85,
      disruptedHours: 2.5,
      peakHourMultiplier: 2.0,
      coverageRate: 0.70,
      zoneFactor: 1.0
    });
    
    expect(result).toBe(298);
  });
  
  it('should apply zone risk factor correctly', () => {
    const result = calculatePayout({
      baselineHourlyEarning: 85,
      disruptedHours: 2.5,
      peakHourMultiplier: 2.0,
      coverageRate: 0.70,
      zoneFactor: 1.40 // High-risk zone
    });
    
    expect(result).toBe(417);
  });
});
```


### 18.2 Integration Testing

```typescript
// Example: End-to-end trigger → claim → payout flow
describe('Trigger to Payout Flow', () => {
  it('should process claim automatically when trigger fires', async () => {
    // Setup: Create worker and active policy
    const worker = await createTestWorker({
      partnerId: 'TEST001',
      primaryZone: 'chennai_tambaram',
      baselineHourlyEarning: 85
    });
    
    const policy = await createTestPolicy({
      workerId: worker.id,
      planTier: 'plus',
      status: 'active'
    });
    
    // Simulate trigger event
    const trigger = await triggerService.simulateTrigger({
      type: 'heavy_rainfall',
      zoneId: 'chennai_tambaram',
      actualValue: 52.3,
      timestamp: new Date()
    });
    
    // Wait for claims processing
    await sleep(2000);
    
    // Verify claim created
    const claims = await claimsService.getWorkerClaims(worker.id);
    expect(claims).toHaveLength(1);
    expect(claims[0].approvalStatus).toBe('auto_approved');
    
    // Verify payout processed
    expect(claims[0].payoutStatus).toBe('completed');
    expect(claims[0].calculatedPayout).toBe(298);
  });
});
```

### 18.3 Load Testing

```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '2m', target: 1000 },  // Ramp up to 1000 users
    { duration: '5m', target: 1000 },  // Stay at 1000 users
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

export default function () {
  // Test trigger evaluation endpoint
  const res = http.get('http://localhost:4000/api/triggers/active');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## 19. Security Considerations

### 19.1 Threat Model

| Threat | Impact | Mitigation |
|---|---|---|
| GPS Spoofing | High | Accelerometer validation, peer cluster analysis, cell tower triangulation |
| Credential Theft | High | JWT with short expiry, refresh token rotation, httpOnly cookies |
| SQL Injection | High | Parameterized queries, ORM usage, input validation |
| DDoS Attack | Medium | Rate limiting, Cloudflare protection, Redis-based throttling |
| Man-in-the-Middle | High | TLS 1.3 enforcement, certificate pinning |
| Insider Fraud | Medium | Role-based access control, audit logging, multi-approval workflows |

### 19.2 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// API rate limiting
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Stricter limit for enrollment endpoint
const enrollmentLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:enroll:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 enrollments per hour per IP
  message: 'Enrollment limit reached, please try again later'
});

app.use('/api/', apiLimiter);
app.use('/api/workers/enroll', enrollmentLimiter);
```

### 19.3 Input Validation

```typescript
import { z } from 'zod';

// Worker enrollment validation schema
const enrollmentSchema = z.object({
  partnerId: z.string()
    .min(5)
    .max(20)
    .regex(/^[A-Z0-9]+$/),
  
  upiId: z.string()
    .regex(/^[\w.-]+@[\w.-]+$/),
  
  phone: z.string()
    .regex(/^[6-9]\d{9}$/),
  
  language: z.enum(['tamil', 'hindi', 'english']),
  
  planTier: z.enum(['lite', 'plus', 'max'])
});

// Validate request body
app.post('/api/workers/enroll', async (req, res) => {
  try {
    const validated = enrollmentSchema.parse(req.body);
    // Process enrollment
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
});
```

---

## 20. Scalability Considerations

### 20.1 Horizontal Scaling

```mermaid
graph TB
    LB[Load Balancer<br/>Nginx/Cloudflare]
    
    subgraph "API Instances"
        API1[Node.js API 1]
        API2[Node.js API 2]
        API3[Node.js API 3]
    end
    
    subgraph "ML Instances"
        ML1[FastAPI ML 1]
        ML2[FastAPI ML 2]
    end
    
    Redis[(Redis<br/>Shared State)]
    PG[(PostgreSQL<br/>Primary)]
    PGR[(PostgreSQL<br/>Read Replicas)]
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> Redis
    API2 --> Redis
    API3 --> Redis
    
    API1 --> ML1
    API2 --> ML1
    API3 --> ML2
    
    API1 --> PG
    API2 --> PG
    API3 --> PG
    
    API1 --> PGR
    API2 --> PGR
    API3 --> PGR
```

### 20.2 Database Partitioning

```sql
-- Partition claims table by month for efficient queries
CREATE TABLE claims (
  id UUID,
  worker_id UUID,
  trigger_time TIMESTAMPTZ,
  -- other columns
) PARTITION BY RANGE (trigger_time);

-- Create monthly partitions
CREATE TABLE claims_2026_03 PARTITION OF claims
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

CREATE TABLE claims_2026_04 PARTITION OF claims
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

-- Auto-create future partitions
CREATE EXTENSION pg_partman;
SELECT partman.create_parent('public.claims', 'trigger_time', 'native', 'monthly');
```

---

## 21. Disaster Recovery

### 21.1 Backup Strategy

```yaml
# Automated backup schedule
Database Backups:
  Frequency: Daily at 2:00 AM IST
  Retention: 30 days
  Type: Full backup + WAL archiving
  Storage: AWS S3 / Google Cloud Storage
  
Redis Backups:
  Frequency: Every 6 hours
  Retention: 7 days
  Type: RDB snapshot
  
Application State:
  Frequency: Real-time replication
  Type: Multi-region deployment
```

### 21.2 Recovery Procedures

```mermaid
flowchart TD
    Incident[System Failure Detected] --> Assess[Assess Impact]
    
    Assess --> Type{Failure Type?}
    
    Type -->|Database| DB[Database Recovery]
    Type -->|API| API[API Recovery]
    Type -->|External API| Ext[Fallback Mode]
    
    DB --> DBRestore[Restore from latest backup]
    DBRestore --> DBReplay[Replay WAL logs]
    DBReplay --> DBVerify[Verify data integrity]
    
    API --> APIRedeploy[Deploy to backup region]
    APIRedeploy --> APIRoute[Update DNS routing]
    APIRoute --> APIVerify[Health check]
    
    Ext --> ExtCache[Use cached data]
    ExtCache --> ExtAlert[Alert admin]
    ExtAlert --> ExtMonitor[Monitor for recovery]
    
    DBVerify --> Resume[Resume Operations]
    APIVerify --> Resume
    ExtMonitor --> Resume
```

---

## 22. Future Enhancements

### 22.1 Phase 2 Features (Post-Hackathon)

- **Real Platform Integration**: Live Swiggy/Zomato API connections
- **Multi-language Support**: Hindi, Bengali, Telugu, Kannada
- **Advanced Analytics**: Cohort analysis, churn prediction, lifetime value
- **Worker Credit Scoring**: Financial identity based on verified earnings
- **Referral Program**: Worker-to-worker referral incentives

### 22.2 Phase 3 Features (Production)

- **Native Mobile Apps**: React Native for iOS and Android
- **Blockchain Audit Trail**: Immutable claim records
- **Reinsurance Integration**: Automated reinsurance claim filing
- **Multi-platform Support**: Zepto, Blinkit, Dunzo expansion
- **Advanced Fraud ML**: Deep learning models for pattern detection

---

## 23. Compliance & Regulatory Design

### 23.1 Audit Trail

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  actor_id UUID,
  actor_role VARCHAR(50),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
```

### 23.2 Data Retention Policy

```typescript
const retentionPolicy = {
  // Active data
  activePolicies: 'Indefinite',
  activeWorkers: 'Indefinite',
  
  // Historical data
  expiredPolicies: '7 years', // Regulatory requirement
  completedClaims: '7 years',
  triggerEvents: '5 years',
  
  // Operational data
  auditLogs: '3 years',
  fraudInvestigations: '5 years',
  
  // Temporary data
  sessionTokens: '7 days',
  cacheData: '1 hour - 24 hours',
  
  // Anonymization
  workerPII: 'Anonymize after 2 years of inactivity'
};
```

---

## 24. API Documentation

### 24.1 OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: RideSuraksha API
  version: 1.0.0
  description: Parametric income insurance platform API

paths:
  /api/workers/enroll:
    post:
      summary: Enroll new worker
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                partnerId:
                  type: string
                  example: "ZOM12345"
                upiId:
                  type: string
                  example: "raju@paytm"
                phone:
                  type: string
                  example: "9876543210"
                language:
                  type: string
                  enum: [tamil, hindi, english]
                planTier:
                  type: string
                  enum: [lite, plus, max]
      responses:
        '201':
          description: Worker enrolled successfully
        '400':
          description: Invalid input
        '409':
          description: Worker already exists
```

---

## Appendix A: Configuration Files

### A.1 Environment Variables

```env
# Application
NODE_ENV=production
PORT=4000
API_URL=https://api.RideSuraksha.in

# Database
DATABASE_URL=postgresql://user:pass@host:5432/RideSuraksha
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# External APIs
OPENWEATHER_API_KEY=your-key
IMD_API_KEY=your-key
CPCB_API_KEY=your-key
GOOGLE_MAPS_API_KEY=your-key

# Payment
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret

# ML Service
ML_API_URL=http://ml-service:8000
ML_API_KEY=your-ml-key

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

---

## Appendix B: Glossary

- **BHE**: Baseline Hourly Earning — worker's 4-week rolling average hourly income
- **PHM**: Peak Hour Multiplier — time-based earning potential adjustment (0.5× to 2.0×)
- **CR**: Coverage Rate — percentage of loss covered by plan tier (50%, 70%, 80%)
- **ZF**: Zone Factor — risk-based premium adjustment (0.85× to 1.40×)
- **PWA**: Progressive Web App — installable web application
- **Parametric Insurance**: Insurance that pays based on predefined trigger thresholds, not actual loss assessment
- **Loss Ratio**: Claims paid / Premiums collected (target: 60-65%)
- **Reserve Adequacy**: Reserve balance / Active liability (target: >2.0×)

---

**Document Status**: Draft v1.0  
**Next Review**: Post-Phase 1 Implementation  
**Maintained By**: RideSuraksha Engineering Team
