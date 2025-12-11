# 🕒 ChronoTrack  
### A lightweight, production-style Job & Run Tracking Microservice with full CI/CD and containerized deployment.

ChronoTrack is a **TypeScript-based microservice** that tracks *jobs* and their *executions ("runs")*, built with strong software engineering and DevOps practices.  
It is designed as a **realistic portfolio project** for demonstrating skills in:

- Backend architecture (Node.js + TypeScript)
- CI/CD pipeline design (GitHub Actions)
- Containerization (Docker)
- Data engineering patterns
- API design & service abstraction
- Local platform engineering without needing cloud resources

ChronoTrack simulates core components of an automation or data platform — exactly the kind used for orchestration, metadata tracking, and operational monitoring.

---

# 📌 Features

### ✅ Core API
- Create, list, retrieve, update **jobs**
- Create, list, retrieve, update **job runs**
- Job run statuses: `PENDING`, `RUNNING`, `SUCCESS`, `FAILED`
- Health endpoint (`/health`)
- Fully typed request/response models (TypeScript)

### ✅ Architecture
- Modular folder structure: controllers → services → repositories
- Clean repository interface for DB swapability
- Service-level business logic and validation
- SQLite persistence (or in-memory mode for development)

### ✅ DevOps & CI/CD
- Automated CI pipeline:
  - linting (ESLint)
  - type-checking (tsc)
  - unit tests (Vitest/Jest)
  - Docker image build
  - vulnerability scanning (Trivy)
  - smoke tests (container boot + `/health` check`)
- Ready for CD to local/remote environments
- Docker Compose deployment for local platform simulation

---

# 🧱 Project Structure

```
chronotrack/
│
├─ backend/
│  ├─ src/
│  │  ├─ api/           # Route handlers / controllers
│  │  ├─ services/      # Business logic
│  │  ├─ repositories/  # DB access layer (SQLite + in-memory)
│  │  ├─ models/        # TS interfaces, enums, DTOs
│  │  ├─ config/        # Env & application config
│  │  └─ index.ts       # App entry point
│  ├─ tests/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ tsconfig.json
│
├─ frontend/ (optional milestone)
│  ├─ src/
│  ├─ Dockerfile
│  └─ package.json
│
├─ .github/workflows/
│   ├─ ci.yml
│   └─ cd.yml
│
├─ docker-compose.yml
├─ docs/
│   ├─ architecture.md
│   ├─ api-spec.md
│   └─ milestones.md
│
└─ README.md
```

---

# 🚀 Getting Started

## 1. Install dependencies

```sh
cd backend
npm install
```

## 2. Start development server

```sh
npm run dev
```

Default port: **3000**

Health endpoint:
```
GET http://localhost:3000/health
```

---

# 🐳 Running with Docker

## Build image
```sh
docker build -t chronotrack-backend ./backend
```

## Run with Docker Compose
```sh
docker-compose up --build
```

---

# 🔧 Environment Variables

| Variable | Description |
|---------|-------------|
| `PORT` | API port (default 3000) |
| `DATABASE_FILE` | Location for SQLite DB |
| `NODE_ENV` | `development` or `production` |

Example `.env`:

```
PORT=3000
DATABASE_FILE=./data/chronotrack.db
NODE_ENV=development
```

---

# 🧪 Testing

Run unit tests:

```sh
npm run test
```

Tests cover:
- Service logic
- Validation and status transitions
- Repository behavior (mocked or SQLite test DB)

---

# 🔄 CI/CD Overview

ChronoTrack includes a full GitHub Actions pipeline:

### CI pipeline (on pull requests)
- Lint code
- Type-check
- Unit tests
- Build backend
- Build Docker image
- Security scan of container
- Smoke test using `/health` endpoint

### CD pipeline (on `main`)
- Rebuild + version/tag images
- Upload artifacts
- (Optional) auto-deploy using Docker Compose

---

# 🗺 Roadmap (Milestones)

### ✔ Milestone 1  
Project skeleton, tooling, basic server, CI setup

### ✔ Milestone 2  
Job + Run services, controller layer, in-memory DB

### ✔ Milestone 3  
SQLite persistence layer + migrations

### ✔ Milestone 4  
Containerization + docker-compose deployment

### ✔ Milestone 5  
Full CI/CD automation

### ⏳ Milestone 6 — Optional  
React frontend for visualizing jobs and runs

### ⭐ Stretch Goals  
- OpenAPI/Swagger  
- API auth  
- Metrics + Grafana dashboard  
- K6 load testing  
- Event-driven run triggers

---

# 📚 Documentation

- `docs/milestones.md` — Full milestone/ticket breakdown
- `docs/api-spec.md` — API documentation
- `docs/architecture.md` — Technical design & system overview

---

# 🧩 Why This Project Exists

ChronoTrack is intentionally designed to help a senior engineer demonstrate:

- Architecture thinking  
- Clean code and modular design  
- CI/CD experience  
- Infrastructure understanding  
- TypeScript fluency  
- Ability to design + document a platform component  
- Containerization & deployment patterns  

This project is strong portfolio material for roles such as:

- **Principal Engineer**
- **Platform Architect**
- **Lead Data Engineer**
- **Automation Lead**

---

# 📜 License

MIT (or choose your preferred license)
