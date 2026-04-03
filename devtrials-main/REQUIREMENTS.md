# GigShield — Product Requirements Document

> **Version**: 1.0  
> **Last Updated**: March 2026  
> **Project**: Guidewire DEVTrails 2026 Hackathon

---

## 1. Executive Summary

### Problem Statement

<cite index="1-0,1-1">India has over 11 million gig delivery workers on platforms like Zomato, Swiggy, and Zepto. These workers operate in an economic razor's edge with average monthly earnings of ₹14,000–₹18,000, savings buffer of ₹4,000–₹6,000, and income lost per major weather disruption of 20-30%.</cite>

<cite index="1-2">Traditional insurance products are inaccessible — they require paperwork, bank accounts, fixed salaries, and weeks-long claim processing.</cite>

### Solution

<cite index="1-3">GigShield solves this with a parametric income insurance product — one where payouts are triggered automatically by verified external disruptions (weather, pollution, civil events), with no claims form, no adjuster, and no waiting period for approval.</cite>

### Target User

<cite index="2-0">Raju (Ramesh Kumar), Age 26, City: Chennai (operates in Tambaram & Chrompet zones), Platform: Zomato delivery partner (3 years), Monthly Earnings: ₹16,500 avg (₹550/day × ~30 active days), Working Hours: 10 AM - 10 PM, 6 days/week, Savings Buffer: ₹5,500, Primary Language: Tamil, Phone: Android, 4G, Zomato partner app, Bank Account: Yes — linked to Zomato payout</cite>

---

## 2. Functional Requirements

### 2.1 Worker Enrollment & Onboarding

**REQ-WE-001**: Worker Registration
- System SHALL accept Swiggy/Zomato Partner ID as primary identifier
- System SHALL auto-fetch 4-week earning history from platform API
- System SHALL support Tamil language UI for Chennai workers
- System SHALL complete onboarding in under 3 minutes
- System SHALL require UPI ID for payout linkage

**REQ-WE-002**: Risk Profile Calculation
- System SHALL calculate worker's Baseline Hourly Earning (BHE) from 4-week history
- System SHALL determine worker's primary operating zone from GPS cluster data
- System SHALL assign zone risk score (0.85× to 1.40×) based on historical disruption frequency

**REQ-WE-003**: Plan Selection
- System SHALL present three plan tiers: Guard Lite, Guard Plus, Guard Max
- System SHALL recommend plan based on worker's earnings and zone risk
- System SHALL display weekly premium amount clearly before confirmation

**REQ-WE-004**: Waiting Period
- <cite index="5-4">System SHALL enforce 3-day waiting period from enrollment before first claim eligibility</cite>
- System SHALL notify worker when coverage becomes active
- System SHALL send SMS + WhatsApp confirmation upon activation

---

### 2.2 Premium Management

**REQ-PM-001**: Weekly Premium Structure
- <cite index="5-3">System SHALL offer three zone risk tiers: Low risk (₹89), Medium risk (₹110), High risk (₹130)</cite>
- System SHALL apply zone risk multiplier to base premium
- System SHALL support dynamic premium adjustment (±20%) based on AI forecast

**REQ-PM-002**: Premium Collection
- <cite index="5-6">System SHALL auto-deduct premium from platform payout every Friday</cite>
- System SHALL pause auto-renewal if worker inactive for 14+ days
- System SHALL notify worker 24 hours before deduction
- System SHALL allow worker to pause/resume coverage

**REQ-PM-003**: Dynamic Pricing (AI Module 1)
- System SHALL run XGBoost model every Friday evening
- System SHALL adjust next week's premium based on predicted risk
- System SHALL notify worker of premium changes before Monday deduction

---

### 2.3 Parametric Trigger Monitoring

**REQ-TM-001**: Trigger Definitions
- <cite index="5-7">System SHALL monitor Heavy Rainfall: >50mm in 3hrs in worker's GPS zone via OpenWeatherMap API</cite>
- <cite index="5-7">System SHALL monitor Air Quality Crisis: AQI > 300 (Hazardous) sustained 4hrs via AQICN / OpenAQ API</cite>
- <cite index="5-7">System SHALL monitor Flood Zone Alert: Official flood alert in district via IMD Flood Warning API</cite>
- <cite index="6-0">System SHALL monitor Civil Disruption: Section 144 or declared shutdown via Mock curfew/bandh JSON feed</cite>
- <cite index="6-0">System SHALL monitor Extreme Heat Index: Feels-like temp > 45°C, 3hrs in peak via OpenWeatherMap</cite>

**REQ-TM-002**: Trigger Polling
- System SHALL poll external APIs every 5 minutes
- System SHALL log all trigger events to TimescaleDB
- System SHALL deduplicate trigger events using Redis cache
- System SHALL handle API failures gracefully with fallback sources

**REQ-TM-003**: Zone-Based Trigger Matching
- System SHALL match trigger events to affected pin-code zones
- System SHALL identify all active workers in affected zones
- System SHALL initiate eligibility checks for matched workers

---

### 2.4 Claims Processing

**REQ-CP-001**: Eligibility Verification
- <cite index="6-0">System SHALL verify worker GPS was in trigger zone at alert time (platform data)</cite>
- <cite index="6-0">System SHALL verify worker's order flow dropped ≥ 80% during disruption window</cite>
- <cite index="6-0">System SHALL verify waiting period passed + monthly cap not exceeded</cite>
- System SHALL reject claims failing any eligibility check

**REQ-CP-002**: Fraud Detection (AI Module 2)
- System SHALL score every claim using Isolation Forest model (0.0–1.0)
- System SHALL evaluate GPS consistency, motion sensor data, peer cluster patterns
- System SHALL apply rule-based overrides for high-confidence fraud signals
- System SHALL route claims based on fraud score:
  - 0.0–0.3: Auto-approve, instant payout
  - 0.3–0.6: Approve with background review flag
  - 0.6–0.8: 24-hour hold, manual review queue
  - 0.8–1.0: Deny claim, flag account

**REQ-CP-003**: Payout Calculation
- System SHALL calculate payout using formula: `Payout = BHE × DH × PHM × CR × ZF`
- System SHALL apply Peak Hour Multiplier based on disruption time window
- System SHALL apply Coverage Rate based on worker's plan tier
- System SHALL apply Zone Factor based on worker's operating zone

**REQ-CP-004**: Payout Execution
- <cite index="5-7">System SHALL process payouts: Heavy Rainfall ₹800, Air Quality Crisis ₹600, Flood Zone Alert ₹800</cite>
- <cite index="6-0">System SHALL process payouts: Civil Disruption ₹700, Extreme Heat Index ₹500</cite>
- System SHALL disburse via Razorpay UPI integration
- System SHALL complete payout within tier-specific timeframe (2-24 hours)
- System SHALL send SMS notification in worker's language upon payout

**REQ-CP-005**: Monthly Event Cap
- <cite index="5-5">System SHALL enforce maximum 3 payouts per calendar month per worker</cite>
- System SHALL reject claims exceeding monthly cap
- System SHALL notify worker when approaching cap limit

---

### 2.5 Worker Dashboard (PWA)

**REQ-WD-001**: Coverage Status View
- System SHALL display current plan tier and weekly premium
- System SHALL display coverage active/inactive status
- System SHALL display remaining monthly event cap (X/3 events used)
- System SHALL display next premium deduction date

**REQ-WD-002**: Claims History
- System SHALL display all past claims with date, trigger type, payout amount
- System SHALL display pending claims with estimated payout time
- System SHALL display denied claims with reason

**REQ-WD-003**: Earnings Protection Summary
- System SHALL display total earnings protected (cumulative payouts)
- System SHALL display weekly coverage summary
- System SHALL display upcoming risk forecast for worker's zone

**REQ-WD-004**: Progressive Web App
- System SHALL function as installable PWA on Android devices
- System SHALL support offline viewing of coverage status
- System SHALL be accessible via deep link from Swiggy/Zomato partner app

---

### 2.6 Insurer Dashboard

**REQ-ID-001**: Real-Time Monitoring Panel
- System SHALL display live trigger status across all monitored zones
- System SHALL display reserve balance and active liability
- System SHALL display buffer percentage and status (GREEN/AMBER/RED)
- System SHALL display active policy count by city
- System SHALL display current week's claims filed, paid, and loss ratio

**REQ-ID-002**: Zone Risk Map
- System SHALL display interactive map with pin-code level color coding
- System SHALL show GREEN/AMBER/RED zones based on reserve exposure
- System SHALL display predicted disruption probability for next 72 hours
- System SHALL support drill-down to zone-level policy and claim details

**REQ-ID-003**: Predictive Analytics Panel (AI Module 3)
- System SHALL display next week's predicted claim count by city
- System SHALL display predicted total payout liability with confidence interval
- System SHALL display recommended premium adjustment for next week
- System SHALL display seasonal risk calendar showing upcoming high-risk periods

**REQ-ID-004**: Fraud Intelligence Panel
- System SHALL display real-time fraud score distribution across pending claims
- System SHALL display flagged accounts for manual review
- System SHALL generate weekly fraud pattern report
- System SHALL alert on GPS spoofing attempt detection

**REQ-ID-005**: Reserve Management
- System SHALL calculate current reserve adequacy ratio
- System SHALL trigger alerts when reserve drops below 2× coverage threshold
- System SHALL support manual pause of new policy issuances by zone
- System SHALL integrate with reinsurance partner notification system

---

### 2.7 Platform Portal (Swiggy/Zomato Integration)

**REQ-PP-001**: Worker Data Integration
- System SHALL fetch worker login status in real-time
- System SHALL fetch worker GPS location data during active hours
- System SHALL fetch worker order flow data (acceptance rate, completion count)
- System SHALL fetch weekly payout amount for premium deduction

**REQ-PP-002**: Premium Deduction
- System SHALL coordinate with platform for Friday payout deduction
- System SHALL handle insufficient balance scenarios gracefully
- System SHALL notify worker if premium deduction fails

**REQ-PP-003**: GigShield Banner Integration
- System SHALL display GigShield enrollment banner in partner app
- System SHALL provide deep link to GigShield PWA
- System SHALL track conversion rate from banner to enrollment

---

## 3. Non-Functional Requirements

### 3.1 Performance

**REQ-PERF-001**: Response Time
- Worker PWA SHALL load in under 3 seconds on 4G connection
- API endpoints SHALL respond in under 500ms (p95)
- Payout processing SHALL complete within tier-specific SLA

**REQ-PERF-002**: Scalability
- System SHALL support 100,000 active policies
- System SHALL handle 10,000 concurrent trigger evaluations
- System SHALL process 5,000 claims per hour during mass disruption events

**REQ-PERF-003**: Availability
- System SHALL maintain 99.5% uptime
- Trigger monitoring SHALL have zero downtime during critical weather windows
- Database SHALL support automatic failover

### 3.2 Security

**REQ-SEC-001**: Authentication
- System SHALL use JWT tokens for API authentication
- System SHALL hash passwords using bcrypt
- System SHALL support role-based access control (worker, insurer, admin)

**REQ-SEC-002**: Data Protection
- System SHALL encrypt sensitive data at rest
- System SHALL use HTTPS for all API communication
- System SHALL comply with data privacy regulations

**REQ-SEC-003**: Fraud Prevention
- System SHALL implement three-layer fraud detection architecture
- System SHALL detect GPS spoofing via accelerometer cross-validation
- System SHALL flag suspicious claim patterns for manual review

### 3.3 Reliability

**REQ-REL-001**: Data Integrity
- System SHALL maintain transactional consistency for all financial operations
- System SHALL log all claim decisions with full audit trail
- System SHALL support claim replay for debugging

**REQ-REL-002**: Fault Tolerance
- System SHALL handle external API failures without data loss
- System SHALL queue failed payouts for retry
- System SHALL alert administrators of critical system failures

### 3.4 Usability

**REQ-USE-001**: Language Support
- Worker PWA SHALL support Tamil language for Chennai pilot
- System SHALL support Hindi and English for future expansion
- SMS notifications SHALL be sent in worker's preferred language

**REQ-USE-002**: Accessibility
- Worker PWA SHALL function on low-end Android devices (₹8,000–₹12,000 range)
- System SHALL work on 4G connections with intermittent connectivity
- UI SHALL be optimized for small screens (5-6 inch displays)

**REQ-USE-003**: Simplicity
- Worker enrollment SHALL require only Partner ID input
- System SHALL eliminate all form filling and document uploads
- Coverage SHALL be invisible after setup (SMS-driven communication)

---

## 4. Business Rules

### 4.1 Coverage Rules

**BR-001**: Coverage Scope
- System SHALL cover ONLY lost earning hours/wages caused by verified external parametric events
- System SHALL NOT cover vehicle repairs, health insurance, accident medical bills, or personal circumstance-based claims

**BR-002**: Waiting Period
- System SHALL enforce 3-day waiting period from enrollment
- System SHALL prevent claims during waiting period
- System SHALL apply waiting period to re-enrollments after coverage pause

**BR-003**: Monthly Event Cap
- System SHALL enforce maximum 3 payouts per calendar month per worker
- System SHALL reset cap on 1st of each month
- System SHALL notify worker when cap is reached

**BR-004**: Weekly Renewal
- System SHALL auto-renew coverage every Monday at 6:00 AM
- System SHALL deduct premium from Friday platform payout
- System SHALL pause renewal if worker inactive for 14+ consecutive days

### 4.2 Payout Rules

**BR-005**: Peak Hour Multiplier
- System SHALL apply 2.0× multiplier for 6:30 PM – 10:30 PM (dinner rush)
- System SHALL apply 1.5× multiplier for 11:30 AM – 2:30 PM (lunch rush)
- System SHALL apply 0.7× multiplier for 2:30 PM – 6:30 PM (afternoon lull)
- System SHALL apply 0.5× multiplier for 10:30 PM – 11:30 AM (off-peak)

**BR-006**: Zone Risk Factor
- System SHALL apply 0.85× factor for low-risk zones (score 1-3)
- System SHALL apply 1.00× factor for medium-risk zones (score 4-6)
- System SHALL apply 1.20× factor for high-risk zones (score 7-8)
- System SHALL apply 1.40× factor for very high-risk zones (score 9-10)

**BR-007**: Coverage Rate by Tier
- Guard Lite SHALL cover 50% of calculated loss
- Guard Plus SHALL cover 70% of calculated loss
- Guard Max SHALL cover 80% of calculated loss

---

## 5. System Requirements

### 5.1 Worker App (PWA)

**Functional Capabilities**:
- Worker registration and onboarding
- Plan selection and premium management
- Coverage status viewing
- Claims history viewing
- Earnings protection summary
- Profile and settings management

**Technical Requirements**:
- Built with Next.js + React + TypeScript
- Styled with TailwindCSS + shadcn/ui
- Installable as PWA on Android
- Offline-capable for status viewing
- Responsive design for 5-6 inch screens

### 5.2 Platform Portal (Swiggy/Zomato View)

**Functional Capabilities**:
- Worker data API integration
- GPS verification and location tracking
- Order flow monitoring
- Premium deduction coordination
- GigShield banner display in partner app

**Technical Requirements**:
- RESTful API integration with platform backends
- Real-time data sync via webhooks
- Secure API authentication

### 5.3 Insurer Dashboard

**Functional Capabilities**:
- Real-time trigger status monitoring
- Reserve health tracking
- Active policy management
- Claims review and approval
- Fraud detection and investigation
- Predictive analytics and forecasting
- Zone risk map visualization
- Loss ratio reporting

**Technical Requirements**:
- Built with Next.js + React + TypeScript
- Real-time updates via Socket.io
- Data visualization with Recharts + D3.js
- Interactive maps with Leaflet.js
- Desktop-optimized layout

### 5.4 Backend API

**Functional Capabilities**:
- Policy CRUD operations
- Claims processing pipeline
- Trigger monitoring engine
- Fraud detection service
- Premium calculation service
- Payout processing
- Authentication and authorization

**Technical Requirements**:
- Built with Node.js + Express
- Real-time events via Socket.io
- Scheduled jobs via Node-cron
- JWT + bcrypt authentication
- RESTful API design

### 5.5 Database Layer

**Functional Capabilities**:
- Policy data storage
- Claims transaction records
- Worker profile management
- Trigger event time-series storage
- Fraud detection history
- Reserve balance tracking

**Technical Requirements**:
- PostgreSQL for relational data
- TimescaleDB extension for time-series trigger events
- Redis for caching and session management
- Database migrations and version control

### 5.6 ML/AI Service

**Functional Capabilities**:
- Dynamic premium calculation (XGBoost)
- Fraud detection scoring (Isolation Forest)
- Reserve forecasting (LSTM)
- Feature engineering pipeline

**Technical Requirements**:
- Built with Python + FastAPI
- ML frameworks: scikit-learn, XGBoost, TensorFlow
- Data processing: Pandas + NumPy
- REST API for model serving
- Model versioning and retraining pipeline

---

## 6. Integration Requirements

### 6.1 External APIs

**REQ-INT-001**: Weather APIs
- System SHALL integrate OpenWeatherMap API for rainfall and heat data
- System SHALL integrate IMD API for official weather alerts
- System SHALL poll APIs every 5 minutes during active monitoring
- System SHALL handle API rate limits and failures

**REQ-INT-002**: Air Quality APIs
- System SHALL integrate CPCB API for AQI data
- System SHALL integrate AQICN or OpenAQ as backup source
- System SHALL monitor AQI thresholds in real-time

**REQ-INT-003**: Traffic and Flood APIs
- System SHALL integrate Google Maps Traffic API for waterlogging detection
- System SHALL integrate IMD Flood Warning API (or mock)
- System SHALL validate flood alerts against multiple sources

**REQ-INT-004**: Payment Gateway
- System SHALL integrate Razorpay for UPI payouts
- System SHALL use Razorpay Test Mode for hackathon demo
- System SHALL handle payout failures with retry logic
- System SHALL log all payment transactions

**REQ-INT-005**: Platform APIs (Mocked)
- System SHALL integrate with Swiggy/Zomato APIs for worker data
- System SHALL fetch login status, GPS location, order flow data
- System SHALL coordinate premium deduction from platform payouts
- System SHALL use mock APIs for hackathon demonstration

---

## 7. Data Requirements

### 7.1 Worker Data Model

```typescript
Worker {
  id: string
  partnerId: string (Swiggy/Zomato ID)
  name: string
  phone: string
  language: 'tamil' | 'hindi' | 'english'
  upiId: string
  platform: 'swiggy' | 'zomato'
  primaryZone: string
  baselineHourlyEarning: number
  enrollmentDate: Date
  coverageStatus: 'active' | 'paused' | 'waiting'
  planTier: 'lite' | 'plus' | 'max'
  weeklyPremium: number
  monthlyEventCount: number
  lastPremiumDeduction: Date
}
```

### 7.2 Policy Data Model

```typescript
Policy {
  id: string
  workerId: string
  planTier: 'lite' | 'plus' | 'max'
  weeklyPremium: number
  coverageRate: number (0.5 | 0.7 | 0.8)
  monthlyEventCap: number (2 | 3 | 4)
  payoutSpeed: string ('24h' | '12h' | '2h')
  startDate: Date
  endDate: Date
  status: 'active' | 'paused' | 'expired'
  zoneRiskFactor: number
}
```

### 7.3 Claim Data Model

```typescript
Claim {
  id: string
  workerId: string
  policyId: string
  triggerType: string
  triggerTime: Date
  zoneId: string
  disruptedHours: number
  peakHourMultiplier: number
  calculatedPayout: number
  fraudScore: number
  eligibilityStatus: 'passed' | 'failed'
  approvalStatus: 'auto_approved' | 'pending_review' | 'approved' | 'denied'
  payoutStatus: 'pending' | 'processing' | 'completed' | 'failed'
  payoutTime: Date
  transactionId: string
}
```

### 7.4 Trigger Event Data Model

```typescript
TriggerEvent {
  id: string
  triggerType: string
  zoneId: string
  timestamp: Date
  dataSource: string
  thresholdValue: number
  actualValue: number
  affectedWorkerCount: number
  status: 'active' | 'resolved'
  metadata: object
}
```

---

## 8. Compliance & Regulatory Requirements

**REQ-COMP-001**: Data Privacy
- System SHALL comply with Indian data protection regulations
- System SHALL obtain explicit consent for data collection
- System SHALL allow workers to request data deletion

**REQ-COMP-002**: Financial Regulations
- System SHALL maintain audit trail for all financial transactions
- System SHALL generate regulatory reports for IRDAI compliance
- System SHALL implement KYC verification for high-value policies

**REQ-COMP-003**: Insurance Regulations
- <cite index="11-3">System SHALL operate as hackathon prototype; production would require IRDAI regulatory approval, actuarial certification, and platform partnership agreements</cite>
- System SHALL document actuarial assumptions and risk models
- System SHALL maintain reserve adequacy per regulatory guidelines

---

## 9. Testing Requirements

### 9.1 Functional Testing

**REQ-TEST-001**: Unit Testing
- All backend services SHALL have >80% code coverage
- All ML models SHALL have validation test suites
- All API endpoints SHALL have integration tests

**REQ-TEST-002**: End-to-End Testing
- System SHALL test complete enrollment → trigger → payout flow
- System SHALL test fraud detection with simulated spoofing attempts
- System SHALL test reserve circuit breaker activation

**REQ-TEST-003**: Load Testing
- System SHALL test 10,000 concurrent trigger evaluations
- System SHALL test 5,000 claims per hour processing capacity
- System SHALL test database performance under load

### 9.2 Mock Data Requirements

**REQ-MOCK-001**: Worker Data
- System SHALL generate 100 mock workers across 3 cities
- Mock data SHALL include realistic earning patterns
- Mock data SHALL include GPS location histories

**REQ-MOCK-002**: Trigger Simulation
- System SHALL support manual trigger simulation for demo
- System SHALL generate historical trigger event data
- System SHALL support replay of past disruption scenarios

---

## 10. Deployment Requirements

**REQ-DEPLOY-001**: Infrastructure
- Frontend SHALL be deployed on Vercel
- Backend SHALL be deployed on Render
- Database SHALL use managed PostgreSQL + Redis
- System SHALL use Docker for local development

**REQ-DEPLOY-002**: CI/CD
- System SHALL use GitHub Actions for automated testing
- System SHALL run tests on all pull requests
- System SHALL support automated deployment to staging environment

**REQ-DEPLOY-003**: Monitoring
- System SHALL log all errors to centralized logging service
- System SHALL monitor API performance and uptime
- System SHALL alert on critical failures

---

## 11. Success Metrics

### 11.1 Product Metrics

- **Enrollment Rate**: Target 60% of workers who view banner
- **Retention Rate**: Target 85% weekly renewal rate
- **Claim Approval Rate**: Target >95% auto-approval rate
- **Payout Speed**: Target <6 hours average payout time
- **Fraud Detection Accuracy**: Target <5% false positive rate

### 11.2 Business Metrics

- **Loss Ratio**: Target 60-65% (industry healthy range)
- **Reserve Adequacy**: Maintain >2× coverage ratio
- **Net Margin**: Target 13-15% per worker
- **Customer Acquisition Cost**: Target ₹0 (platform distribution)

### 11.3 Technical Metrics

- **API Uptime**: Target 99.5%
- **API Response Time**: Target <500ms p95
- **Fraud Detection Latency**: Target <5 minutes
- **ML Model Accuracy**: Premium model R² >0.75, Fraud model AUC >0.85

---

## 12. Out of Scope (Phase 1)

The following features are explicitly OUT OF SCOPE for the hackathon prototype:

- Native mobile app development (using PWA instead)
- Real Swiggy/Zomato API integration (using mocks)
- Production payment processing (using Razorpay test mode)
- Multi-language support beyond Tamil (English fallback only)
- Vehicle damage coverage
- Health/accident insurance
- Personal loan products
- Credit scoring features (future phase)

---

## 13. Dependencies & Assumptions

### 13.1 Dependencies

- Swiggy/Zomato platform API access (mocked for hackathon)
- OpenWeatherMap API free tier availability
- IMD/CPCB government API reliability
- Razorpay test mode functionality
- Worker smartphone GPS accuracy

### 13.2 Assumptions

- Workers have Android smartphones with GPS capability
- Workers have UPI accounts linked to phone numbers
- Platform payouts occur weekly on Fridays
- Workers check SMS notifications regularly
- Internet connectivity available for enrollment and payout notification

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| GPS spoofing by workers | High | Three-layer fraud detection with accelerometer validation |
| External API downtime | Medium | Multiple data sources, fallback APIs, caching |
| Catastrophic monsoon season | High | Reinsurance agreements, monthly event caps, reserve monitoring |
| Low worker adoption | Medium | Platform distribution, Tamil language UI, zero-friction enrollment |
| Actuarial model inaccuracy | High | Conservative loss ratio targets, dynamic pricing, weekly retraining |

---

## Appendix A: Glossary

- **BHE**: Baseline Hourly Earning — worker's 4-week rolling average hourly income
- **PHM**: Peak Hour Multiplier — time-based earning potential adjustment (0.5× to 2.0×)
- **CR**: Coverage Rate — percentage of loss covered by plan tier (50%, 70%, 80%)
- **ZF**: Zone Factor — risk-based premium adjustment (0.85× to 1.40×)
- **PWA**: Progressive Web App — installable web application
- **UPI**: Unified Payments Interface — India's instant payment system
- **IMD**: India Meteorological Department
- **CPCB**: Central Pollution Control Board
- **IRDAI**: Insurance Regulatory and Development Authority of India
- **AQI**: Air Quality Index
- **Loss Ratio**: Claims paid / Premiums collected (target: 60-65%)

---

**Document Status**: Draft v1.0  
**Next Review**: Post-Phase 1 Completion
