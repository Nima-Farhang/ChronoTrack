# ChronoTrack – Architecture & Design Document

## 1. Overview

**ChronoTrack** is a lightweight, production-style microservice for tracking **jobs** and their **executions ("runs")**.  
It is designed to resemble a real-world platform component you would find in an automation, orchestration, or data platform.

Core goals:

- Demonstrate clean backend architecture in **TypeScript (Node.js)**.
- Showcase **CI/CD**, **containerization**, and **modern engineering practices**.
- Run fully **locally**, with no dependency on cloud infrastructure.

---

## 2. System Context

ChronoTrack sits in the **platform layer** and exposes a REST API:

- Upstream systems (or humans) define **jobs**.
- These jobs have **runs** representing individual executions.
- Other services or tools can:
  - create jobs,
  - start runs,
  - mark them as completed/failed,
  - query historical runs.

For this project, interaction is via:

- HTTP REST API (backend)
- Optional React frontend for visualizing jobs and runs

There are no external integrations in v1; data is persisted locally using **SQLite**.

---

## 3. High-Level Architecture

ChronoTrack follows a classic **layered architecture**:

1. **API Layer (Controllers / Routes)**
   - Handles HTTP requests and responses.
   - Parses and validates input.
   - Maps routes to service methods.
   - Translates domain errors into HTTP status codes.

2. **Service Layer (Business Logic)**
   - Implements rules around jobs and runs.
   - Validates state transitions for job runs (e.g., `PENDING` → `RUNNING` → `SUCCESS` / `FAILED`).
   - Coordinates between repositories and API contracts.
   - Acts as the main abstraction layer for business logic.

3. **Repository Layer (Data Access)**
   - Provides an abstract interface for persistence:
     - `JobRepository`
     - `JobRunRepository`
   - Has two implementations:
     - In-memory (for early development and tests)
     - SQLite-based (for real persistence)
   - Hides SQL / DB details from services.

4. **Infrastructure & Config**
   - Express server setup
   - Database connection (SQLite)
   - Environment configuration (port, DB file path)
   - Logging (console-based for v1)

All layers are written in **TypeScript**, with explicit types for models, DTOs, and interfaces.

---

## 4. Project Structure

```text
chronotrack/
│
├─ backend/
│  ├─ src/
│  │  ├─ api/
│  │  │  ├─ routes/        # Route definitions
│  │  │  └─ controllers/   # Request → service mapping
│  │  ├─ services/         # Business logic
│  │  ├─ repositories/     # Data access (interfaces + implementations)
│  │  ├─ models/           # Domain models and enums
│  │  ├─ config/           # Env/config helpers
│  │  └─ index.ts          # App entry point
│  ├─ tests/               # Unit and integration tests
│  ├─ Dockerfile
│  ├─ package.json
│  └─ tsconfig.json
│
├─ frontend/ (optional)
│  ├─ src/
│  ├─ Dockerfile
│  └─ package.json
│
├─ .github/workflows/      # CI/CD pipelines
│   ├─ ci.yml
│   └─ cd.yml
│
├─ docker-compose.yml      # Local multi-service orchestration
└─ docs/
   ├─ architecture.md      # This document
   ├─ api-spec.md          # HTTP API spec
   └─ milestones.md        # Milestones & tickets
```

---

## 5. Domain Model

### 5.1 Job

Represents a logical unit of work (for example: "Daily ETL", "Reconcile Billing", "Refresh Dashboard").

**Fields (example):**
- `id` (string | number) – unique identifier
- `name` (string) – human-readable name
- `description` (string, optional)
- `type` (string, optional) – category/type of job
- `createdAt` (Date)
- `updatedAt` (Date)
- `archived` (boolean, default: false)

### 5.2 JobRun

Represents a single execution attempt of a job.

**Fields (example):**
- `id` (string | number)
- `jobId` (foreign key to Job)
- `status` (enum: `PENDING`, `RUNNING`, `SUCCESS`, `FAILED`)
- `startedAt` (Date, nullable)
- `finishedAt` (Date, nullable)
- `errorMessage` (string, nullable)
- `metadata` (JSON, optional) – additional info (e.g., triggering user, parameters)

### 5.3 Status Transitions

Valid transitions (example rules):

- `PENDING` → `RUNNING`
- `RUNNING` → `SUCCESS`
- `RUNNING` → `FAILED`

Invalid transitions (should be rejected by services):

- `SUCCESS` → `RUNNING`
- `FAILED` → `RUNNING`
- etc.

The **service layer** is responsible for enforcing these rules.

---

## 6. Data Storage & Persistence

### 6.1 In-Memory Repository (Phase 1)

Used for initial implementation and unit tests.  
Stores jobs / runs in JS arrays or Maps.

Pros:
- Simple and fast to iterate.
- Zero external dependencies.

Cons:
- Non-persistent.
- Not realistic for production.

### 6.2 SQLite Repository (Phase 2+)

**SQLite** is used as the default persistent store for local development.

- Database file specified by `DATABASE_FILE` environment variable.
- Tables:
  - `jobs`
  - `job_runs`

Schemas (example, simplified):

```sql
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  archived INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE job_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  error_message TEXT,
  metadata TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

The **repository layer** encapsulates these details so the service layer remains DB-agnostic.

---

## 7. API Design

The HTTP API is REST-style and JSON-based.

### Core Endpoints (example)

- `GET /health`  
  - Healthcheck endpoint.

- `GET /jobs`  
  - List all jobs (with filters in future).

- `POST /jobs`  
  - Create a new job.

- `GET /jobs/:id`  
  - Get a job by ID.

- `PATCH /jobs/:id`  
  - Update job fields (name, description, archived flag).

- `GET /jobs/:id/runs`  
  - List runs for a given job.

- `POST /jobs/:id/runs`  
  - Create a new run for a job (usually `PENDING` or `RUNNING`).

- `GET /runs/:runId`  
  - Get a specific run by ID.

- `PATCH /runs/:runId`  
  - Update the status / timestamps / error message for a run.

All endpoints return JSON, with consistent success and error shapes.

Detailed request/response payloads are defined in `api-spec.md`.

---

## 8. Error Handling & Logging

### Error Handling

- Validation errors → `400 Bad Request`
- Resource not found → `404 Not Found`
- Invalid state transitions → `409 Conflict`
- Unexpected errors → `500 Internal Server Error`

A central Express error-handling middleware converts thrown exceptions into structured JSON error responses.

### Logging

Initial version uses simple console logging for:

- Job creation
- Run creation
- Status changes
- Startup/shutdown events
- Errors

This can later be replaced with structured logging (e.g., pino, Winston) or forwarded to a log aggregation system.

---

## 9. Configuration & Environment

Configuration is driven by environment variables (12-factor style):

- `PORT` – HTTP server port (default: 3000)
- `DATABASE_FILE` – Path to SQLite DB file (e.g., `./data/chronotrack.db`)
- `NODE_ENV` – `development` / `production`

A small config module centralizes reading and validating these values.

---

## 10. Deployment & Containerization

ChronoTrack runs as a containerized service locally.

### Backend Dockerfile

- Multi-stage build:
  - Stage 1: install deps + build TypeScript.
  - Stage 2: copy built JS + production dependencies.
- Runs as a non-root user.
- Exposes the configured port.

### Docker Compose

`docker-compose.yml` orchestrates:

- `backend` service.
- (Optional) Named volume for SQLite database.

Example usage:

```sh
docker-compose up --build
```

This mimics a simple production deployment topology but remains fully local.

---

## 11. CI/CD Pipeline (GitHub Actions)

The system includes a modern CI/CD pipeline:

### CI (on PR / push)

- **Lint:** ESLint
- **Type-check:** `tsc --noEmit`
- **Tests:** Jest/Vitest unit tests
- **Build:** compile TypeScript
- **Docker Build:** build backend image
- **Security Scan:** container vulnerability scan (e.g., Trivy)
- **Smoke Test:** run container and hit `/health`

### CD (on main branch)

- Rebuild and tag Docker images (`latest`, `vX.Y.Z`, `sha-<hash>`).
- Publish artifacts (and optionally push to a container registry).
- (Optional future) Trigger deployment job that runs Docker Compose on a target host.

---

## 12. Non-Functional Requirements

- **Performance:**  
  - Suitable for small to moderate workloads (local, dev, demo).  
  - Not optimized for high throughput but can be extended.

- **Reliability:**  
  - Persistence via SQLite ensures data durability between restarts.  
  - CI pipeline catches regressions early.

- **Maintainability:**  
  - Layered architecture (API / services / repositories).  
  - TypeScript types and interfaces.  
  - Tests and linting as baseline quality gates.

- **Extensibility:**  
  - Repository pattern allows switching to Postgres or another DB.  
  - API endpoints designed with future filters and pagination in mind.  
  - Easy to integrate auth, metrics, or event streaming later.

---

## 13. Future Extensions

Potential enhancements to evolve ChronoTrack into a more production-like platform component:

1. **Auth & Authorization**
   - API keys or JWT auth.
   - Role-based access control for job management.

2. **Advanced Querying**
   - Filtering runs by status, time range, or job type.
   - Pagination and sorting endpoints.

3. **Notifications & Webhooks**
   - Emit events on run completion.
   - Allow users to register webhooks for job status changes.

4. **Observability**
   - Metrics endpoint (Prometheus-style).
   - Tracing using OpenTelemetry.
   - Logging integration with ELK / Loki.

5. **Multi-tenant Support**
   - Associate jobs with tenants/projects.
   - Add access boundaries.

6. **Kubernetes Deployment**
   - Add Helm chart.
   - Integrate with a K8s-based environment when available.

---

## 14. Summary

ChronoTrack is intentionally small in scope but **rich in architecture and practice**.  
It demonstrates how to design and build a clean, testable, and deployable microservice using:

- TypeScript + Node.js
- Layered architecture
- Repository pattern
- SQLite-based persistence
- Docker + Docker Compose
- GitHub Actions CI/CD

This makes it a strong portfolio example for modern **Platform / Data / Automation Engineering** roles.
