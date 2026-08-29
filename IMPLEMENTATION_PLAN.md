# Kisan Nighaban — MVP Implementation Plan

## 1. Problem Statement

**Farmers in South Asia lose 15–30% of crop yield annually to climate events** (heat stress, drought, flooding) that are increasingly unpredictable. Existing weather apps provide raw forecasts but do not translate them into **crop-specific risk assessments** or **actionable recommendations** a farmer can act on.

**Kisan Nighaban** bridges this gap: it ingests weather forecasts and crop data, computes a **Climate Risk Score**, and delivers plain-language recommendations so farmers can take preventive action *before* damage occurs.

---

## 2. Target Users

| Persona | Description |
|---|---|
| **Primary** | Small-to-medium farmers (or farm co-operatives) who grow seasonal crops and need to make daily/weekly decisions about irrigation, spraying, and harvesting. |
| **Secondary** | Agricultural extension officers or NGOs advising groups of farmers who need a quick risk overview for a region. |

---

## 3. MVP Scope — What's In and What's Out

### In Scope (MVP)

| # | Feature | Type |
|---|---------|------|
| 1 | **Farm Registration** — farmer selects crop type, sowing date, and location (lat/lon or district) | Traditional CRUD |
| 2 | **Weather Ingestion** — fetch current + 7-day forecast from a free weather API | Traditional API integration |
| 3 | **Climate Risk Scoring** — analyze weather data against crop-specific thresholds to produce a risk score (0–100) | **AI-powered** |
| 4 | **Actionable Recommendations** — generate context-aware advisories (e.g., "Delay pesticide spraying — rain expected in 6 hours") | **AI-powered** |
| 5 | **Dashboard** — single-page view showing risk score, forecast summary, and recommendations | Traditional UI |

### Out of Scope (Post-MVP)

- Satellite imagery / NDVI analysis
- Soil sensor integration
- Multi-language support (Hindi, Urdu, Bengali)
- Push notifications / SMS alerts
- Historical yield tracking and analytics
- User authentication and multi-tenant support
- Mobile app

---

## 4. AI vs. Traditional Logic — Separation of Concerns

This is a core MVP principle: **use AI only where it provides genuine value**.

### Traditional Software Logic (No AI needed)

| Component | Reason |
|-----------|--------|
| Farm CRUD (create, read, update farms) | Standard database operations |
| Weather API fetching and caching | Deterministic API integration |
| Risk score visualization (gauge, color coding) | UI rendering |
| Threshold-based alert flags (e.g., temp > 40 °C = "extreme heat") | Simple conditional rules |
| Forecast display (temperature charts, rain probability bars) | Data visualization |

### AI-Powered Components (Genuine AI value)

| Component | Why AI? | AI Approach |
|-----------|---------|-------------|
| **Climate Risk Score generation** | Combining multiple weather variables (temperature, humidity, rainfall, wind) with crop growth stage to produce a single composite risk score requires nuanced reasoning over non-linear relationships that hard-coded formulas cannot capture well. | LLM-based analysis with structured output (JSON). The LLM receives weather data + crop profile and returns a risk score with breakdown by risk category. |
| **Actionable Recommendations** | Translating raw risk data into context-aware, prioritized, plain-language actions that consider the crop type, growth stage, and local conditions. Rule-based systems would need hundreds of hand-written rules. | LLM generates a short list of prioritized recommendations given the risk assessment, crop profile, and current growth stage. |

---

## 5. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND (React)                   │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Farm     │  │  Dashboard   │  │  Risk Detail  │  │
│  │  Setup    │  │  (Risk Score │  │  (Forecast +  │  │
│  │  Form     │  │   + Actions) │  │   History)    │  │
│  └─────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│        │               │                  │          │
└────────┼───────────────┼──────────────────┼──────────┘
         │               │                  │
         ▼               ▼                  ▼
┌──────────────────────────────────────────────────────┐
│                BACKEND (FastAPI)                      │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ /api/farms  │  │ /api/weather │  │ /api/risk  │  │
│  │  (CRUD)     │  │  (fetch +    │  │  (AI score │  │
│  │             │  │   cache)     │  │  + advice) │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬─────┘  │
│         │                │                  │        │
│         ▼                ▼                  ▼        │
│  ┌───────────┐   ┌────────────┐   ┌──────────────┐  │
│  │  SQLite   │   │ Open-Meteo │   │  LLM API     │  │
│  │  Database │   │ Weather API│   │  (OpenAI or  │  │
│  │           │   │ (free, no  │   │   compatible)│  │
│  │           │   │  key reqd) │   │              │  │
│  └───────────┘   └────────────┘   └──────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Tech Stack (MVP)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React 19 + Vite | Already scaffolded; fast dev experience |
| Styling | Plain CSS / CSS Variables | Already set up; no extra dependency needed for MVP |
| Backend | FastAPI + Uvicorn | Already scaffolded; async support for API calls |
| Database | SQLite (via `aiosqlite` + `sqlalchemy`) | Zero config; perfect for MVP and demo |
| Weather Data | [Open-Meteo API](https://open-meteo.com/) | Free, no API key required, provides 7-day forecasts |
| AI / LLM | OpenAI-compatible API (GPT-4o-mini or similar) | Structured output, low cost, fast responses |
| HTTP Client | `httpx` (async) | For calling weather API and LLM API from FastAPI |

---

## 6. Data Models

### 6.1 Farm

```
Farm
├── id            : UUID (PK)
├── name          : string          — e.g., "North Field"
├── crop_type     : string          — e.g., "wheat", "rice", "cotton"
├── sowing_date   : date            — when the crop was sown
├── latitude      : float           — GPS latitude
├── longitude     : float           — GPS longitude
├── district      : string          — human-readable location name
├── created_at    : datetime
└── updated_at    : datetime
```

### 6.2 Risk Assessment

```
RiskAssessment
├── id              : UUID (PK)
├── farm_id         : UUID (FK → Farm)
├── assessed_at     : datetime
├── risk_score      : integer (0–100)
├── risk_level      : string — "low" | "moderate" | "high" | "critical"
├── risk_breakdown  : JSON — { heat_stress: 72, drought: 45, flooding: 10, wind: 5 }
├── recommendations : JSON — [{ priority: 1, title: "...", detail: "..." }, ...]
├── weather_snapshot: JSON — raw weather data used for this assessment
└── growth_stage    : string — e.g., "vegetative", "flowering", "grain-filling"
```

### 6.3 Predefined Crop Profiles (seed data, not a DB table)

```python
CROP_PROFILES = {
    "wheat": {
        "optimal_temp_range": [15, 25],       # °C
        "heat_stress_threshold": 35,            # °C
        "max_rainfall_tolerance": 50,           # mm/day
        "drought_sensitivity": "moderate",      # low / moderate / high
        "growth_stages": ["germination", "tillering", "stem-extension", "heading", "flowering", "grain-filling", "maturity"],
        "stage_durations_days": [7, 21, 20, 15, 10, 25, 15],
    },
    "rice": { ... },
    "cotton": { ... },
    "maize": { ... },
}
```

---

## 7. API Endpoints

### 7.1 Farm Management (Traditional CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/farms` | Register a new farm |
| `GET` | `/api/farms` | List all farms |
| `GET` | `/api/farms/{farm_id}` | Get farm details |
| `PUT` | `/api/farms/{farm_id}` | Update farm details |
| `DELETE` | `/api/farms/{farm_id}` | Delete a farm |

### 7.2 Weather (Traditional API Integration)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/weather/{farm_id}` | Get current + 7-day forecast for a farm (fetched from Open-Meteo, cached for 1 hour) |

### 7.3 Risk Assessment (AI-Powered)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/risk/{farm_id}/assess` | Trigger a new risk assessment (calls LLM) |
| `GET` | `/api/risk/{farm_id}/latest` | Get the latest risk assessment for a farm |
| `GET` | `/api/risk/{farm_id}/history` | Get risk assessment history (last 7 days) |

### 7.4 Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (already implemented) |

---

## 8. AI Integration — Detailed Design

### 8.1 Climate Risk Scoring Prompt

The LLM receives a structured prompt containing:

1. **Crop profile** — type, thresholds, current growth stage (computed from sowing date).
2. **Weather data** — current conditions + 7-day forecast (temperature highs/lows, precipitation, humidity, wind speed).
3. **Instructions** — score each risk category 0–100, compute an overall weighted score, and classify the risk level.

**Expected LLM output (structured JSON):**

```json
{
  "risk_score": 68,
  "risk_level": "high",
  "risk_breakdown": {
    "heat_stress": 78,
    "drought": 45,
    "flooding": 12,
    "wind_damage": 20
  },
  "growth_stage": "flowering",
  "growth_stage_day": 73,
  "summary": "High heat stress risk during flowering stage. Temperatures expected to exceed 38°C for 3 consecutive days."
}
```

### 8.2 Recommendations Prompt

A second LLM call (or combined with scoring in a single call) generates recommendations:

**Expected LLM output:**

```json
{
  "recommendations": [
    {
      "priority": 1,
      "title": "Increase irrigation frequency",
      "detail": "Apply light irrigation every 2 days during peak afternoon hours to reduce canopy temperature by 2-3°C.",
      "urgency": "immediate"
    },
    {
      "priority": 2,
      "title": "Postpone pesticide application",
      "detail": "Rain is forecasted in 48 hours. Delay spraying to avoid wash-off and wasted input costs.",
      "urgency": "within-48-hours"
    }
  ]
}
```

### 8.3 AI Call Flow

```
User clicks "Assess Risk"
        │
        ▼
Backend fetches latest weather data (Open-Meteo, cached)
        │
        ▼
Backend computes growth stage from sowing_date + crop profile
        │
        ▼
Backend builds structured prompt (weather + crop + stage)
        │
        ▼
LLM returns risk_score + breakdown + recommendations (structured JSON)
        │
        ▼
Backend saves RiskAssessment to DB
        │
        ▼
Frontend displays risk score, breakdown, and recommendations
```

### 8.4 Guardrails

- **Structured output enforcement**: Use LLM's JSON mode or structured output feature to guarantee parseable responses.
- **Fallback**: If LLM call fails, fall back to a simple rule-based scoring (weighted average of threshold exceedances) so the app remains functional.
- **Cost control**: GPT-4o-mini at ~$0.15 per 1M input tokens; a single assessment prompt is ~500 tokens → negligible cost for MVP.
- **No AI for simple logic**: Growth stage calculation, weather caching, and threshold comparisons are pure Python — no LLM involvement.

---

## 9. Frontend Pages and Components

### 9.1 Page Layout

The MVP is a **single-page application** with two main views switched via tabs or a simple nav:

```
┌─────────────────────────────────────────────┐
│  🌾 Kisan Nighaban          [Farm Setup]    │
│                              [Dashboard]    │
├─────────────────────────────────────────────┤
│                                             │
│              (Active View)                   │
│                                             │
└─────────────────────────────────────────────┘
```

### 9.2 Farm Setup View

A simple form to register a farm:

```
┌─────────────────────────────────────┐
│  Register Your Farm                 │
│                                     │
│  Farm Name:    [____________]       │
│  Crop Type:    [▼ Wheat      ]      │
│  Sowing Date:  [2025-11-01  ]       │
│  District:     [____________]       │
│  Latitude:     [____________]       │
│  Longitude:    [____________]       │
│                                     │
│  [Save Farm]                        │
└─────────────────────────────────────┘
```

### 9.3 Dashboard View

```
┌─────────────────────────────────────────────────────┐
│  Farm: North Field — Wheat (Flowering Stage)        │
│                                                     │
│  ┌───────────────┐  ┌─────────────────────────────┐ │
│  │               │  │  Risk Breakdown             │ │
│  │   RISK SCORE  │  │                             │ │
│  │               │  │  Heat Stress   ████████ 78  │ │
│  │     68        │  │  Drought       ████░░░ 45   │ │
│  │   HIGH        │  │  Flooding      █░░░░░░ 12   │ │
│  │               │  │  Wind Damage   ██░░░░░ 20   │ │
│  │  [Re-assess]  │  │                             │ │
│  └───────────────┘  └─────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Recommendations                                │ │
│  │                                                 │ │
│  │  🔴 1. Increase irrigation frequency           │ │
│  │     Apply light irrigation every 2 days...      │ │
│  │                                                 │ │
│  │  🟡 2. Postpone pesticide application           │ │
│  │     Rain is forecasted in 48 hours...           │ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │  7-Day Forecast                                 │ │
│  │  Mon  Tue  Wed  Thu  Fri  Sat  Sun              │ │
│  │  38°  39°  36°  34°  32°  33°  35°             │ │
│  │  ☀️   ☀️   🌧️   🌧️   ⛅   ⛅   ☀️              │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 9.4 Component Breakdown

| Component | File | Responsibility |
|-----------|------|----------------|
| `App` | `App.jsx` | Root layout, navigation state, farm selection |
| `FarmSetup` | `components/FarmSetup.jsx` | Farm registration form (CRUD) |
| `Dashboard` | `components/Dashboard.jsx` | Main dashboard container |
| `RiskGauge` | `components/RiskGauge.jsx` | Circular/semicircular risk score display |
| `RiskBreakdown` | `components/RiskBreakdown.jsx` | Horizontal bar chart of risk categories |
| `Recommendations` | `components/Recommendations.jsx` | Prioritized action cards |
| `ForecastChart` | `components/ForecastChart.jsx` | 7-day temperature + rain forecast display |
| `api.js` | `services/api.js` | Centralized fetch wrapper for backend API |

---

## 10. Backend File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, CORS, router includes
│   ├── config.py                # Settings (DB path, LLM API key, etc.)
│   ├── database.py              # SQLAlchemy engine, session, base
│   ├── models/
│   │   ├── __init__.py
│   │   ├── farm.py              # Farm SQLAlchemy model
│   │   └── risk_assessment.py   # RiskAssessment SQLAlchemy model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── farm.py              # Pydantic request/response schemas
│   │   └── risk.py              # Pydantic schemas for risk endpoints
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── farms.py             # Farm CRUD routes
│   │   ├── weather.py           # Weather fetch route
│   │   └── risk.py              # Risk assessment routes
│   ├── services/
│   │   ├── __init__.py
│   │   ├── weather_service.py   # Open-Meteo API client + caching
│   │   ├── crop_profiles.py     # Crop profile definitions + growth stage calc
│   │   └── ai_service.py        # LLM integration (risk scoring + recommendations)
│   └── fallback/
│       ├── __init__.py
│       └── rule_based_risk.py   # Rule-based fallback if LLM is unavailable
├── requirements.txt
└── run.py                       # Entry point: uvicorn runner
```

---

## 11. Implementation Phases

### Phase 1 — Foundation (Backend Core)

**Goal**: Get the data layer and basic APIs working.

| Task | File(s) | Details |
|------|---------|---------|
| 1.1 Add dependencies | `requirements.txt` | Add `sqlalchemy`, `aiosqlite`, `httpx`, `pydantic-settings`, `python-dotenv` |
| 1.2 Set up config | `app/config.py` | Load settings from env vars / `.env` (DB URL, LLM API key) |
| 1.3 Set up database | `app/database.py` | SQLAlchemy async engine + session factory with SQLite |
| 1.4 Create models | `app/models/farm.py`, `app/models/risk_assessment.py` | SQLAlchemy ORM models |
| 1.5 Create Pydantic schemas | `app/schemas/farm.py`, `app/schemas/risk.py` | Request/response validation |
| 1.6 Implement farm CRUD router | `app/routers/farms.py` | POST/GET/PUT/DELETE for farms |
| 1.7 Register routers | `app/main.py` | Include all routers, add startup event for DB table creation |

**Acceptance**: Can create, list, update, and delete farms via API.

---

### Phase 2 — Weather Integration

**Goal**: Fetch and serve real weather data for any registered farm.

| Task | File(s) | Details |
|------|---------|---------|
| 2.1 Implement weather service | `app/services/weather_service.py` | Call Open-Meteo forecast API using lat/lon; parse response into a clean schema |
| 2.2 Add in-memory caching | `app/services/weather_service.py` | Cache weather responses for 1 hour keyed by `(lat, lon)` |
| 2.3 Implement crop profiles | `app/services/crop_profiles.py` | Define crop threshold data; implement `compute_growth_stage(crop, sowing_date)` |
| 2.4 Create weather router | `app/routers/weather.py` | `GET /api/weather/{farm_id}` — looks up farm, fetches weather, returns forecast |

**Acceptance**: Given a farm with valid coordinates, the API returns a 7-day forecast.

---

### Phase 3 — AI Risk Assessment

**Goal**: LLM-powered risk scoring and recommendations.

| Task | File(s) | Details |
|------|---------|---------|
| 3.1 Implement AI service | `app/services/ai_service.py` | Build prompt from weather + crop profile; call LLM with structured output; parse response |
| 3.2 Implement rule-based fallback | `app/fallback/rule_based_risk.py` | Simple weighted threshold-exceedance scoring when LLM is unavailable |
| 3.3 Create risk router | `app/routers/risk.py` | `POST /api/risk/{farm_id}/assess`, `GET .../latest`, `GET .../history` |
| 3.4 Wire assessment flow | `app/routers/risk.py` | Fetch weather → compute growth stage → call AI → save to DB → return |

**Acceptance**: Calling `POST /api/risk/{farm_id}/assess` returns a risk score with breakdown and recommendations.

---

### Phase 4 — Frontend

**Goal**: Build the user-facing dashboard and farm setup.

| Task | File(s) | Details |
|------|---------|---------|
| 4.1 API service layer | `src/services/api.js` | Fetch wrapper for all backend endpoints |
| 4.2 Farm Setup form | `src/components/FarmSetup.jsx` | Form with crop dropdown, date picker, lat/lon, district |
| 4.3 Dashboard layout | `src/components/Dashboard.jsx` | Container that loads farm data + latest risk + forecast |
| 4.4 Risk Gauge component | `src/components/RiskGauge.jsx` | SVG-based semicircular gauge (0–100, color-coded) |
| 4.5 Risk Breakdown bars | `src/components/RiskBreakdown.jsx` | Horizontal colored bars per risk category |
| 4.6 Recommendations list | `src/components/Recommendations.jsx` | Priority-ordered action cards with urgency badges |
| 4.7 Forecast display | `src/components/ForecastChart.jsx` | 7-day forecast row with temp + weather icons |
| 4.8 App shell + nav | `src/App.jsx`, `src/App.css` | Tab-based navigation, global layout, clean styling |
| 4.9 Update `index.html` | `index.html` | Set proper title ("Kisan Nighaban"), meta description |

**Acceptance**: User can register a farm, view a dashboard with risk score, see recommendations, and view the 7-day forecast.

---

### Phase 5 — Integration and Polish

**Goal**: End-to-end testing and demo readiness.

| Task | Details |
|------|---------|
| 5.1 Seed demo data | Add a script or startup hook that creates 1–2 demo farms with real coordinates (e.g., Lahore, Punjab) |
| 5.2 Error handling | Graceful error messages for API failures, LLM timeouts, invalid coordinates |
| 5.3 Loading states | Skeleton loaders or spinners while fetching weather / running assessment |
| 5.4 Responsive tweaks | Ensure dashboard is usable on tablet-width screens |
| 5.5 End-to-end test | Manual walkthrough: register farm → view forecast → trigger assessment → read recommendations |

---

## 12. External Dependencies Summary

### Backend (add to `requirements.txt`)

```
fastapi
uvicorn[standard]
sqlalchemy[asyncio]
aiosqlite
httpx
pydantic-settings
python-dotenv
openai
```

### Frontend (add via `npm install`)

```
# No additional npm packages needed for MVP.
# All UI components are hand-built with plain CSS.
# No charting library — use CSS bars and SVG for the gauge.
```

---

## 13. Environment Configuration

Create a `.env` file at the project root:

```env
# LLM Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Database
DATABASE_URL=sqlite+aiosqlite:///./kisan_nighaban.db

# Optional: override weather cache TTL (seconds)
WEATHER_CACHE_TTL=3600
```

---

## 14. Running the MVP

**Backend:**

```bash
cd backend
pip install -r ../requirements.txt
python run.py
# Runs on http://localhost:8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies /api to backend)
```

---

## 15. Demo Walkthrough Script

1. Open the app → see the landing with "Register Your Farm" form.
2. Fill in: Name = "Demo Field", Crop = "Wheat", Sowing Date = 2 months ago, District = "Lahore", Lat = 31.52, Lon = 74.36.
3. Click **Save Farm** → redirected to Dashboard.
4. Dashboard shows farm info, crop growth stage (auto-calculated), and a "Run Risk Assessment" button.
5. Click **Run Risk Assessment** → loading spinner → risk gauge animates to score (e.g., 68 / HIGH).
6. See risk breakdown bars (heat stress high, drought moderate, flooding low).
7. See prioritized recommendations ("Increase irrigation", "Delay pesticide").
8. See 7-day forecast with temperature trend and rain indicators.
9. (Optional) Modify farm to a different crop/location and re-assess to show adaptability.

---

## 16. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **SQLite over PostgreSQL** | Zero-config, file-based, perfect for MVP demo. Easily swappable later. |
| **Open-Meteo over OpenWeatherMap** | Free, no API key required, generous rate limits, good forecast quality. |
| **No user auth** | MVP scope — single-user demo. Auth adds complexity without demo value. |
| **No charting library** | CSS bars + SVG gauge keep bundle small and avoid dependency overhead for simple visualizations. |
| **Two separate LLM calls (score + recommendations)** | Easier to debug, cache independently, and fallback separately. Can be merged into one call later. |
| **Rule-based fallback** | Ensures the app works even without LLM API access (e.g., demo environment with no internet for AI). |
| **Growth stage from sowing date** | Computed deterministically from crop profile durations — no AI needed. |
