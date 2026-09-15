# HealthSnap Backend

A secure, clean, and modern REST API for the **HealthSnap Wellness Companion**, built with **Python**, **FastAPI**, **SQLAlchemy**, **Pydantic**, and **JWT Authentication**.

## Features

- **JWT Authentication**: Secure signup, login, session token validation, and logout.
- **Password Security**: Bcrypt-hashed passwords (passwords never stored in plain-text).
- **User-Isolated Database**: Multi-tenant data segregation with SQLite (PostgreSQL migration ready).
- **REST Endpoints**:
  - `POST /api/auth/signup`: Create user account.
  - `POST /api/auth/login`: Authenticate and receive JWT.
  - `GET /api/auth/me`: Current user session.
  - `GET /api/users/me` & `PUT /api/users/me`: Profile retrieval & settings updates.
  - `POST /api/wellness` & `GET /api/wellness`: Holistic wellness records.
  - `POST /api/wellness/self-report`: Subjective feeling and symptom logging.
  - `POST /api/food/analyze`: Computer vision food photo inspection.
  - `POST /api/food` & `GET /api/food`: Meal history.
  - `POST /api/voice/transcribe`: Audio/speech wellness signal extraction.
  - `POST /api/activity` & `GET /api/activity`: Daily steps and movement.
  - `POST /api/sleep` & `GET /api/sleep`: Circadian rest metrics.
  - `POST /api/ai/analyze`: Transparent multimodal pattern synthesis engine.
  - `GET /api/dashboard`: Aggregated dashboard data payload.
- **Interactive Documentation**: Swagger UI at `http://localhost:8000/docs` and OpenAPI JSON at `http://localhost:8000/openapi.json`.
- **Health Disclaimer**: Built-in non-diagnostic boundaries in all AI and wellness responses.

## Setup & Running Locally

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate a Python virtual environment
**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the development server
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.
Explore Swagger docs at `http://localhost:8000/docs`.
