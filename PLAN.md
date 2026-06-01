# PLAN.md — NewsMind build plan

42 tasks across 8 phases. Work top to bottom. Do not skip validation steps.
Every task that touches code ends with a git commit. Deploy early and often.

When starting a Claude Code session, tell it which task you're on:
> "read CLAUDE.md and PLAN.md — we're working on task 14, dockerizing the RSS Fetcher"

---

## Phase 0 — Repo, CI/CD & infra skeleton
> Do this first, before writing any application code.

- [x] **Task 1** — Create GitHub repo + branch strategy
  - `main` (protected) · `develop` · `feature/*` branches
  - Add `.gitignore` for Java, Node, `.env` files
  - **Commit:** `chore: init repo`

- [x] **Task 2** — Add CLAUDE.md to repo root
  - This is the architecture rules file. Claude Code reads it automatically from here on.
  - **Commit:** `docs: add CLAUDE.md`

- [x] **Task 3** — Write docker-compose.yml — infrastructure only
  - Services: RabbitMQ (`rabbitmq:3-management`), PostgreSQL (`pgvector/pgvector:pg16`), Redis (`redis:7-alpine`)
  - No application services yet
  - **Validate:** `docker compose up` → all 3 containers healthy, RabbitMQ UI at localhost:15672
  - **Commit:** `chore: docker-compose infra skeleton`

- [x] **Task 4** — Set up GitHub Actions CI skeleton
  - File: `.github/workflows/ci.yml`
  - Trigger: push to any branch
  - Step: checkout → placeholder `echo "build ok"` (expand per service as added)
  - **Validate:** push a commit → Actions tab shows green
  - **Commit:** `ci: add GitHub Actions skeleton`

- [x] **Task 5** — Provision Hetzner CX21 VM
  - 2 vCPU, 4GB RAM (~€5/month)
  - SSH in, install Docker + Docker Compose, create deploy user
  - Open ports: 22, 80, 443, 8080
  - *(No commit — server setup)*

- [x] **Task 6** — Add CD step — deploy infra to VM
  - GitHub Actions deploy job (on push to `main`): SSH to VM → `git pull` → `docker compose up -d`
  - Add SSH private key as GitHub secret (`VM_SSH_KEY`), also add `VM_HOST` and `VM_USER`
  - **Validate:** push to main → infra starts on VM automatically
  - **Commit:** `ci: add CD deploy to Hetzner VM`

---

## Phase 1 — Database schema + shared models
> Foundation that all services depend on.

- [x] **Task 7** — Write schema.sql + PostgreSQL init script
  - Enable pgvector extension, create `articles` table with `embedding vector(1536)` column
  - Add ivfflat index for cosine similarity search
  - Mount as Postgres init script in docker-compose.yml
  - **Validate:** `psql -c "\d articles"` shows all columns including vector
  - **Commit:** `feat: postgres schema with pgvector`

- [x] **Task 8** — Create shared Maven parent pom.xml
  - Root `pom.xml` with `<modules>` for all four services
  - Manage dependency versions: Spring Boot 3, Spring AMQP, pgvector-java, openai-java, Lombok
  - Each service `pom.xml` declares `<parent>` pointing here
  - **Commit:** `chore: maven parent pom`

---

## Phase 2 — RSS Fetcher service
> First service. Proves the pipeline skeleton end-to-end.

- [x] **Task 9** — Scaffold RSS Fetcher via Spring Initializr
  - **YOU run this** at start.spring.io: Spring AMQP, Spring JDBC, Lombok, Actuator
  - Save output to `/services/rss-fetcher/`
  - **Commit:** `chore: scaffold rss-fetcher`

- [x] **Task 10** — RabbitMQ config + exchange declaration
  - `RabbitMQConfig.java`: declare `news.fetched` fanout exchange, queue, binding
  - **Validate:** service starts → exchange visible in RabbitMQ management UI (localhost:15672)
  - **Commit:** `feat(rss-fetcher): rabbitmq config and exchange`

- [x] **Task 11** — RSS feed parser (Rome library)
  - `FeedParser.java`: fetch one feed URL, parse with Rome, return `List<RawArticle>`
  - **Validate:** unit test — parses ≥1 article from BBC RSS URL
  - **Commit:** `feat(rss-fetcher): rss feed parser with Rome`

- [x] **Task 12** — URL deduplication via PostgreSQL
  - `ArticleDeduplicator.java`: `INSERT ... ON CONFLICT (url) DO NOTHING`
  - **Validate:** insert same article twice → no duplicate rows in DB
  - **Commit:** `feat(rss-fetcher): url deduplication`

- [x] **Task 13** — Scheduler + publisher wired together
  - `FetchScheduler.java`: `@Scheduled` every 60 min, calls FeedParser for all 6 feeds, deduplicates, publishes each new article as JSON to `news.fetched`
  - **Validate:** trigger manually → messages appear in RabbitMQ queue
  - **Commit:** `feat(rss-fetcher): scheduler and message publisher`

- [ ] **Task 14** — Dockerize RSS Fetcher + add to Compose
  - Multi-stage Dockerfile: build (JDK) → run (JRE)
  - Add `rss-fetcher` to docker-compose.yml with `depends_on: [rabbitmq, postgres]` healthcheck condition
  - **Validate:** `docker compose up` → articles appear in DB after startup
  - Add `mvn build` step to GitHub Actions CI for this service
  - **Commit:** `feat(rss-fetcher): dockerfile and compose integration`

- [ ] **Task 15** — Deploy RSS Fetcher to VM via CD
  - Push to `main` → CD pipeline deploys automatically
  - SSH into VM, run `docker compose logs rss-fetcher`
  - **Validate:** articles are being fetched on the real server
  - **Commit:** `deploy: rss-fetcher live on VM`

---

## Phase 3 — Embedding service
> Articles become searchable vectors.

- [ ] **Task 16** — Scaffold Embedding Service via Spring Initializr
  - **YOU run this** at start.spring.io: Spring AMQP, Spring JDBC, Lombok, Actuator
  - Save output to `/services/embedding-service/`
  - **Commit:** `chore: scaffold embedding-service`

- [ ] **Task 17** — OpenAI embedding client
  - `EmbeddingClient.java`: call `text-embedding-3-small` API, return `float[1536]`
  - **Validate:** unit test — vector length == 1536, values are non-zero
  - **Commit:** `feat(embedding): openai embedding client`

- [ ] **Task 18** — pgvector write — store article + embedding
  - `ArticleRepository.java`: `UPDATE articles SET embedding = ? WHERE id = ?` using pgvector-java `PGvector` type
  - **Validate:** read back the embedding — confirm column is NOT NULL in DB
  - **Commit:** `feat(embedding): pgvector write`

- [ ] **Task 19** — RabbitMQ consumer + full flow
  - `ArticleConsumer.java`: `@RabbitListener` on `news.fetched` queue
  - Flow: consume message → embed → store → publish `news.embedded`
  - **Validate:** `SELECT COUNT(*) FROM articles WHERE embedding IS NOT NULL` > 0
  - **Commit:** `feat(embedding): rabbitmq consumer wired end-to-end`

- [ ] **Task 20** — Dockerize + deploy Embedding Service
  - Add to docker-compose.yml
  - Add `OPENAI_API_KEY` to GitHub secrets and VM `.env` file
  - Push to `main` → CD deploys
  - **Validate:** embeddings flowing on VM — check DB remotely
  - Add CI build step for this service
  - **Commit:** `feat(embedding): dockerfile and deploy`

---

## Phase 4 — Query / RAG service
> The intelligence layer. This is the core of the project.

- [ ] **Task 21** — Scaffold Query Service via Spring Initializr
  - **YOU run this** at start.spring.io: Spring AMQP, Spring JDBC, Spring Data Redis, Lombok, Actuator
  - Save output to `/services/query-service/`
  - **Commit:** `chore: scaffold query-service`

- [ ] **Task 22** — Vector similarity search (pgvector)
  - `VectorRetriever.java`: embed question → `SELECT ... ORDER BY embedding <=> ? LIMIT 5`
  - **Validate:** hardcoded test question → logs show 5 relevant article titles returned
  - **Commit:** `feat(query): vector similarity search`

- [ ] **Task 23** — Prompt builder + OpenAI GPT-4o-mini call
  - `PromptBuilder.java`: build prompt from articles using the template in CLAUDE.md
  - `LlmClient.java`: call `gpt-4o-mini`, return answer string
  - **Validate:** test in a `main()` method — coherent, sourced answer is returned
  - **Commit:** `feat(query): prompt builder and llm client`

- [ ] **Task 24** — Redis cache layer
  - `QueryCache.java`: SHA-256 hash of question as Redis key, TTL 1800s
  - Check cache before calling OpenAI — write to cache after
  - **Validate:** ask same question twice — second call must NOT hit OpenAI (check logs)
  - **Commit:** `feat(query): redis cache layer`

- [ ] **Task 25** — RabbitMQ consumer + reply publisher
  - `QueryConsumer.java`: `@RabbitListener` on `query.requested`
  - Full RAG flow: cache check → vector search → prompt → LLM → publish to `query.answered` with matching `correlationId`
  - **Validate:** publish test message to queue → correct reply appears in `query.answered`
  - **Commit:** `feat(query): rabbitmq consumer and reply publisher`

- [ ] **Task 26** — Dockerize + deploy Query Service
  - Add to docker-compose.yml
  - Push to `main` → CD deploys
  - **Validate:** publish test message manually from VM → answer returned via RabbitMQ
  - Add CI build step for this service
  - **Commit:** `feat(query): dockerfile and deploy`

---

## Phase 5 — API Gateway
> Bridges the frontend (HTTP) with the backend (RabbitMQ).

- [ ] **Task 27** — Scaffold API Gateway via Spring Initializr
  - **YOU run this** at start.spring.io: Spring Web, Spring AMQP, Validation, Lombok, Actuator
  - Save output to `/services/api-gateway/`
  - **Commit:** `chore: scaffold api-gateway`

- [ ] **Task 28** — POST /api/ask endpoint (stub)
  - `QueryController.java`: accept `{ "question": "..." }`, return hardcoded JSON response
  - Configure CORS for `localhost:3000`
  - **Validate:** `curl -X POST localhost:8080/api/ask -d '{"question":"test"}' -H 'Content-Type: application/json'` → 200 with stub JSON
  - **Commit:** `feat(gateway): POST /api/ask stub endpoint`

- [ ] **Task 29** — Wire RabbitMQ request/reply into Gateway
  - `QueryBrokerService.java`: `convertSendAndReceive()` to `query.requested`, 30s timeout
  - Replace stub response with real RabbitMQ call
  - **Validate:** curl → Gateway → RabbitMQ → Query Service → real answer returned
  - **Commit:** `feat(gateway): rabbitmq request/reply wired`

- [ ] **Task 30** — GET /api/health + GET /api/status endpoints
  - Health: verify RabbitMQ + Postgres connectivity
  - Status: total articles indexed + last fetch timestamp
  - **Validate:** both endpoints return valid JSON with correct data
  - **Commit:** `feat(gateway): health and status endpoints`

- [ ] **Task 31** — Dockerize + deploy Gateway
  - Add to docker-compose.yml
  - Push to `main` → CD deploys
  - **Validate:** `curl http://YOUR_VM_IP:8080/api/health` from your local machine → 200
  - Add CI build step for this service
  - **Commit:** `feat(gateway): dockerfile and deploy`

---

## Phase 6 — React frontend
> The user-facing UI. Non-technical users must find it intuitive.

- [ ] **Task 32** — Scaffold frontend via Vite CLI
  - **YOU run:** `npm create vite@latest frontend -- --template react-ts`
  - Then: `cd frontend && npm install && npm run dev`
  - Install Tailwind: follow official Tailwind + Vite setup guide
  - **Commit:** `chore: scaffold frontend`

- [ ] **Task 33** — useAsk hook — API call logic
  - `useAsk.ts`: `POST /api/ask`, manage `loading` / `error` / `result` state
  - **Validate:** test hook with hardcoded question → real answer logged to console
  - **Commit:** `feat(frontend): useAsk hook`

- [ ] **Task 34** — SearchBar + LoadingSkeleton components
  - `SearchBar.tsx`: input + submit button, placeholder `"Ask anything about today's news..."`
  - `LoadingSkeleton.tsx`: animated pulse placeholder (no spinner)
  - Wire `SearchBar` submit to `useAsk`
  - **Commit:** `feat(frontend): SearchBar and LoadingSkeleton`

- [ ] **Task 35** — AnswerCard + SourceCard components
  - `AnswerCard.tsx`: renders the synthesized answer paragraph
  - `SourceCard.tsx`: headline, publication name, "X min ago", external link
  - Wire both to real API response shape
  - **Validate:** full browser test — ask a question, answer + sources appear correctly
  - **Commit:** `feat(frontend): AnswerCard and SourceCard`

- [ ] **Task 36** — Error states + mobile responsive pass
  - Friendly error messages — no HTTP status codes or stack traces visible
  - Test at 375px viewport width — everything readable and usable
  - Add footer: `"Powered by live news · Updated hourly"`
  - **Commit:** `feat(frontend): error states and mobile layout`

- [ ] **Task 37** — Dockerize frontend (nginx) + deploy
  - `Dockerfile`: Vite build → nginx serve static files
  - `nginx.conf`: serve `dist/` + proxy `/api/*` to `api-gateway:8080`
  - Add `frontend` to docker-compose.yml
  - Push to `main` → CD deploys
  - **Validate:** visit `http://YOUR_VM_IP` in browser → full app works end-to-end
  - Add frontend build step to GitHub Actions CI
  - **Commit:** `feat(frontend): dockerfile and deploy`

---

## Phase 7 — Production hardening
> CV-ready, publicly shareable, resilient.

- [ ] **Task 38** — HTTPS via Certbot + custom domain
  - Point domain DNS A record to VM IP
  - SSH into VM: `sudo certbot --nginx -d yourdomain.com`
  - Update `CORS_ALLOWED_ORIGINS` in `.env` to `https://yourdomain.com`
  - **Validate:** `https://yourdomain.com` loads with valid certificate
  - **Commit:** `chore: nginx config for HTTPS`

- [ ] **Task 39** — docker-compose.prod.yml overrides
  - Remove exposed debug ports (RabbitMQ management 15672, Postgres 5432)
  - Add `restart: always` to all services
  - Add `JAVA_OPTS=-Xms128m -Xmx256m` per service (4 services × ~256MB = stays within 4GB)
  - Set `LOG_LEVEL=WARN`
  - **Validate:** `docker compose down && docker compose up -d` → all services recover automatically
  - **Commit:** `chore: production compose overrides`

- [ ] **Task 40** — Dead-letter queues for all RabbitMQ queues
  - Declare `*.dlq` queue alongside each main queue in all service configs
  - **Validate:** publish a malformed message → it lands in DLQ, service keeps running without crashing
  - **Commit:** `feat: dead-letter queues for all consumers`

- [ ] **Task 41** — README with demo + architecture diagram
  - Record a 30-second Loom showing a real question being answered
  - Embed the architecture diagram
  - Add: what it does, tech stack, how to run locally, environment variables needed
  - This is what interviewers and recruiters see first
  - **Commit:** `docs: README complete with demo`

- [ ] **Task 42** — Non-technical user test
  - Ask someone non-technical (friend, family member) to use the app with zero explanation
  - Watch silently — note every moment of hesitation or confusion
  - Fix the top 2–3 friction points found
  - **Commit:** `fix: UX improvements from user test`

---

## Quick reference — commit message prefixes

| Prefix | When to use |
|---|---|
| `feat:` | New functionality |
| `fix:` | Bug fix |
| `chore:` | Setup, scaffolding, config |
| `docs:` | README, CLAUDE.md, comments |
| `ci:` | GitHub Actions changes |
| `deploy:` | Deployment-related changes |
| `test:` | Adding or fixing tests |

---

## How to start a Claude Code session mid-project

Always open with:
```
read CLAUDE.md and PLAN.md — we're working on task [N], [task title]
```

Example:
```
read CLAUDE.md and PLAN.md — we're working on task 22,
vector similarity search in the Query Service
```

Claude Code will know the full architecture, conventions, and exactly where you are
in the build.
