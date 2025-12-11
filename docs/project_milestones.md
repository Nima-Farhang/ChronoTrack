# Project Specification – Automation Job Tracker Service

This document defines the full project outline, milestones, and implementation tickets.

---

## 1. Project Vision

A production-style containerized TypeScript microservice with CI/CD, designed to mimic real-world platform engineering best practices.  
Primary purpose: strengthen architecture, software engineering, and DevOps skills.

---

## 2. Milestones and Tickets

Below are all milestones with detailed developer tickets.

---

# Milestone 1 – Project Skeleton & Foundations

### Tickets

1. **Initialize backend project structure**
   - Create `/backend` folder
   - Initialize `package.json`
   - Install TypeScript, ts-node, Express, dotenv
   - Generate `tsconfig.json`

2. **Set up basic Express server**
   - Create `index.ts`
   - Add `/health` endpoint returning `{ status: "ok" }`
   - Add error handler middleware

3. **Add project tooling**
   - Install ESLint, Prettier
   - Add configuration files: `.eslintrc`, `.prettierrc`
   - Add npm scripts for linting and formatting

4. **Set up basic folder structure**
   ```
   /src
     /api
     /services
     /repositories
     /models
     /config
   ```

5. **GitHub Actions CI (Stage 1)**
   - Workflow runs on PR + push
   - Steps:
     - checkout
     - setup-node
     - install deps
     - run lint
     - run TypeScript no-emit check

6. **Docs update**
   - Add `README.md` with:
     - setup instructions
     - how to run server
     - structure overview

---

# Milestone 2 – Core Domain: Jobs & Job Runs

### Tickets

1. **Define domain models**
   - `Job`
   - `JobRun`
   - Status enum (`PENDING`, `RUNNING`, `SUCCESS`, `FAILED`)

2. **Create service layer for jobs**
   - Create JobService with:
     - create job
     - list jobs
     - get job by id
     - update job
     - archive job (optional)

3. **Create service layer for job runs**
   - create run
   - update run status
   - fetch runs by job
   - get run by id

4. **Create in‑memory repository**
   - JobRepository (CRUD)
   - JobRunRepository

5. **Define API routes**
   - `/jobs` → list, create
   - `/jobs/:id` → get, update, archive
   - `/jobs/:id/runs` → list, create run
   - `/runs/:runId` → get, update

6. **Unit tests (Phase 1)**
   - Test JobService logic
   - Test JobRunService logic
   - Use Vitest or Jest

7. **Docs update**
   - Add `api-spec.md`

---

# Milestone 3 – Persistence Layer (SQLite)

### Tickets

1. **Introduce SQLite**
   - Add DB file in `/data`
   - Add connection helper
   - Add schema init script

2. **Replace in-memory repository**
   - Implement JobRepositorySQLite
   - Implement JobRunRepositorySQLite

3. **Add repository abstraction**
   - Interface: `IJobRepository`, `IJobRunRepository`

4. **Implement DB migrations**
   - Schema for:
     - jobs
     - job_runs

5. **Add integration tests**
   - Use test DB file
   - Test CRUD behaviour

6. **Docs update**
   - update architecture.md with persistence layer

---

# Milestone 4 – Containerization & Local Deployment

### Tickets

1. **Create backend Dockerfile**
   - Multi-stage (build → runtime)
   - Non-root user

2. **Create docker-compose.yml**
   - Services:
     - backend
     - sqlite volume (optional)
   - Auto-reload for dev environment (nodemon)

3. **Add environment variable handling**
   - DATABASE_FILE
   - PORT
   - NODE_ENV

4. **Add `makefile` (optional)**
   - `make dev`
   - `make build`
   - `make run`

5. **Docs update**
   - How to run system:
     ```sh
     docker-compose up --build
     ```

---

# Milestone 5 – CI/CD Pipeline Enhancements

### Tickets

1. **Extend GitHub Actions to run tests**
   - Add Jest/Vitest test step

2. **Add build step**
   - Frontend build (later)
   - Backend compile step

3. **Add Docker build & scan**
   - Build image
   - Use Trivy or similar for vulnerability scanning

4. **Add version tagging**
   - Tag containers as:
     - `latest`
     - `vX.Y.Z`
     - `sha-<short-hash>`

5. **Add smoke test job**
   - Spin up backend container
   - Hit `/health`
   - Fail pipeline if not healthy

6. **Docs update**
   - Include CI pipeline description in `/docs/ci.md`

---

# Milestone 6 – Frontend (Optional v1.1)

### Tickets

1. **Create React + TS frontend**
   - Initialize with Vite
   - Create pages:
     - Job list
     - Job detail with runs
     - Trigger run button

2. **API client wrapper**
   - `/api/jobs`
   - `/api/runs`

3. **Basic components**
   - JobCard
   - JobRunList
   - StatusBadge

4. **Frontend Dockerfile**
   - Multi-stage build → nginx serving static files

5. **Extend docker-compose**
   - Add `frontend` service
   - Reverse proxy optional

6. **CI Integration**
   - Add frontend build to pipeline
   - Add frontend tests

7. **Docs update**

---

# Milestone 7 – Optional Stretch Goals

### Tickets

1. **Add authentication (API key)**
2. **Add rate limiting middleware**
3. **Add OpenAPI/Swagger generation**
4. **Add metrics endpoint**
5. **Add Grafana dashboard instructions**
6. **Add load testing (k6)**

---

# Appendix – Document Type

The description and requirement specification you requested earlier is traditionally called:

### **Software Requirements Specification (SRS)**  
or  
### **Technical Design Document (TDD)**  
or  
### **Architecture & Requirements Overview**

In industry, this document is often simply referred to as:

➡️ **"Project Specification"**  
or  
➡️ **"Engineering Design Brief"**

This markdown file acts as the **combined SRS + Milestone Roadmap + Work Breakdown Structure (WBS)**.

