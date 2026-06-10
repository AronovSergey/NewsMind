# CLAUDE.md — NewsMind

This file is the source of truth for Claude Code when working on this project.
Read it fully before writing any code, creating any file, or running any command.

---

## Git commits

**Never create git commits.** The user commits manually. Do not run `git commit`, `git add`, or any command that stages or commits changes — not even when a task says "Commit: ...". Just finish the code work and stop.

---

## Project overview

NewsMind is a distributed news intelligence platform. Users ask natural language questions
about current events and receive accurate, sourced answers in real time.

The system automatically pulls live news from RSS feeds every hour, processes articles into
vector embeddings via the OpenAI Embeddings API, and uses a RAG (Retrieval-Augmented
Generation) pipeline to answer questions like "What happened in AI this week?" — with
source links backing every answer.

**Primary audience for the deployed UI:** Non-technical users (HR teams, recruiters, general
professionals). The UI must feel like a search engine, not a developer tool.

**Purpose:** Learning project + CV portfolio piece demonstrating distributed systems,
event-driven architecture, RAG/vector search, and full-stack Java/React development.

**Language decision:** The entire backend is Java 21 + Spring Boot 3. No Python services.
This was a deliberate architectural choice to demonstrate a consistent JVM stack and
proficiency with Spring's ecosystem across all service types — including ML-adjacent workloads.

---

## Scaffolding rules

Never run project generators (`npm create`, `spring init`, etc.) — always edit existing files.

---

## Architecture — the golden rule

> **No service talks directly to another service. All inter-service communication flows
> asynchronously through RabbitMQ.**

The only exception: the React frontend talks to the Spring Boot API Gateway via REST.
Everything else is event-driven. If you find yourself writing a direct HTTP call from one
backend service to another, stop and route it through a RabbitMQ exchange instead.

---

## System architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend (Vite + TS)          │  ← User-facing UI
└──────────────────────┬──────────────────────┘
                       │ REST (HTTP)
┌──────────────────────▼──────────────────────┐
│         Spring Boot API Gateway             │  ← Only public-facing backend
│         (Java 21 · Spring Boot 3)           │
└──────────────────────┬──────────────────────┘
                       │
              ┌────────▼────────┐
              │    RabbitMQ     │  ← All async inter-service communication
              └──┬──────┬───────┘
                 │      │       │
   ┌─────────────▼─┐ ┌──▼────────────┐ ┌──▼─────────────┐
   │  RSS Fetcher  │ │ Embedding Svc │ │ Query/RAG Svc  │
   │  Spring Boot  │ │  Spring Boot  │ │  Spring Boot   │
   │  Java 21      │ │  Java 21      │ │  Java 21       │
   └───────┬───────┘ └──────┬────────┘ └──────┬─────────┘
           │                │                  │
   ┌───────▼────────────────▼──┐    ┌──────────▼──────┐
   │   PostgreSQL + pgvector   │    │      Redis       │
   │   articles + chunks       │    │   Query cache    │
   └───────────────────────────┘    └─────────────────┘
```

---

## Shared library (`/services/common/`)

A plain Maven JAR (no Spring Boot main class, no port, no Dockerfile). Contains code shared
between `embedding-service` and `query-service`:

- `com.newsmind.common.openai.OpenAIConfig` — `@Configuration` that exposes a single
  `OpenAIClient` bean, shared by all OpenAI callers in the service
- `com.newsmind.common.openai.EmbeddingClient` — `@Component` that calls the embeddings API
  with exponential-backoff retry

Both `embedding-service` and `query-service` declare `common` as a Maven dependency and
extend their `@SpringBootApplication` scan to include `com.newsmind.common`:
```java
@SpringBootApplication(scanBasePackages = {"com.newsmind.<service>", "com.newsmind.common"})
```

Do not add runtime infrastructure (RabbitMQ listeners, DB access, HTTP endpoints) to `common`.
Keep it a pure utility library.

---

## Services — one job per service

All four backend services share the same technology: **Java 21 + Spring Boot 3**.
Each is its own Maven project with its own Dockerfile.

### 1. RSS Fetcher (`/services/rss-fetcher/`)
- **Job:** Pull articles from RSS feeds on a schedule, deduplicate, publish to RabbitMQ
- **Trigger:** `@Scheduled(fixedDelay = 3600000)` — every 60 minutes
- **Publishes:** `news.fetched` exchange
- **Consumes:** Nothing
- **Key dependencies:** `spring-boot-starter-amqp`, `rome` (RSS parsing), `spring-boot-starter-data-jpa`, `flyway-core`
- **Dedup strategy:** Store article URLs in PostgreSQL; skip any URL already present (`INSERT ... ON CONFLICT DO NOTHING`)
- **Local port:** 8081

### 2. Embedding Service (`/services/embedding-service/`)
- **Job:** Consume fetched articles, generate vector embeddings via OpenAI, store in pgvector
- **Trigger:** RabbitMQ message on `news.fetched`
- **Consumes:** `news.fetched`
- **Publishes:** `news.embedded`
- **Embedding model:** OpenAI `text-embedding-3-small` (1536 dimensions, ~$0.02/1M tokens)
- **Key dependencies:** `spring-boot-starter-amqp`, `openai-java`, `spring-boot-starter-jdbc`, `pgvector-java`, `flyway-core`
- **Flow:** receive message → call OpenAI embeddings API → upsert into `chunks` table (keyed by `article_id + chunk_index`)
- **Local port:** 8082

### 3. Query / RAG Service (`/services/query-service/`)
- **Job:** Receive user questions, run semantic search, generate LLM answers, return results
- **Trigger:** RabbitMQ message on `query.requested`
- **Consumes:** `query.requested`
- **Publishes:** `query.answered` (reply to Gateway's correlation ID)
- **Key dependencies:** `spring-boot-starter-amqp`, `openai-java`, `spring-boot-starter-data-redis`, `spring-boot-starter-jdbc`, `pgvector-java`, `flyway-core`
- **RAG flow:**
  1. Check Redis cache by SHA-256 hash of the question — return cached answer if found
  2. Embed the user question using `text-embedding-3-small`
  3. Query the `chunks` table with pgvector cosine similarity (`<=>`) — join with `articles` for metadata — return top-5
  4. Build a prompt with retrieved context + user question (see template below)
  5. Call OpenAI `gpt-4o-mini` for generation
  6. Cache the answer in Redis (TTL: 1800s)
  7. Publish answer + source metadata to `query.answered`
- **LLM:** OpenAI `gpt-4o-mini`
- **Local port:** 8083

### 4. API Gateway (`/services/api-gateway/`)
- **Job:** Expose REST API to the frontend, bridge HTTP↔RabbitMQ, handle validation
- **Key dependencies:** `spring-boot-starter-web`, `spring-boot-starter-amqp`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `lombok`
- **Endpoints:**
  - `POST /api/ask` — accepts `{ "question": "..." }`, publishes to RabbitMQ, blocks on reply
  - `GET /api/health` — returns `{ "status": "ok", "service": "api-gateway" }`
  - `GET /api/status` — total articles indexed + last fetch timestamp
- **RabbitMQ pattern:** Request/Reply using `RabbitTemplate.convertSendAndReceive()` with correlation IDs
- **Timeout:** 30 seconds — returns `504` with a friendly message if exceeded
- **CORS:** dev allows `http://localhost:3000` and `http://localhost:5173`; prod allows `https://newsmind.media,https://www.newsmind.media`
- **Local port:** 8080

### 5. React Frontend (`/frontend/`)
- **Language:** TypeScript + React 18 + Vite
- **Styling:** TailwindCSS
- **UI requirements:**
  - Single search bar as the hero element — placeholder: *"Ask anything about today's news..."*
  - Results: synthesized answer paragraph first, then 2–3 source cards below it
  - Each source card: headline, publication name, "X minutes ago", external link
  - Loading state: animated skeleton, not a spinner
  - Error state: friendly plain-English message — no stack traces, no HTTP codes
  - Mobile responsive — HR users often browse on phones
  - Footer: *"Powered by live news · Updated hourly"*

---

## RabbitMQ exchanges and queues

```
Exchange: news.fetched     (fanout)   RSS Fetcher      → Embedding Service
Exchange: news.embedded    (fanout)   Embedding Svc    → (logging / future consumers)
Exchange: query.requested  (direct)   API Gateway      → Query Service
Exchange: query.answered   (direct)   Query Service    → API Gateway (reply queue per request)
```

- All queues are **durable**, all messages are **persistent**
- Declare a dead-letter queue (`*.dlq`) alongside every main queue
- Each service declares its own queues on startup via `@Bean Queue` / `@Bean Binding`
- Use `@RabbitListener` for consumers in Spring AMQP

---

## Database schema

### PostgreSQL (`newsmind` database)

Schema is managed by **Flyway** migrations in each DB-touching service (`rss-fetcher`, `embedding-service`, `query-service`). All three services carry the same migration files and run them on startup with `baseline-on-migrate: true`.

Migration files live at `src/main/resources/db/migration/` in each service:
- `V1__init.sql` — baseline: creates `articles` table + pgvector extension
- `V2__create_chunks_table.sql` — creates `chunks` table with vector index
- `V3__migrate_embeddings_to_chunks.sql` — one-time data migration for existing rows
- `V4__drop_embedding_column.sql` — removes the `embedding` column from `articles`

**Current schema (post-migrations):**

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Article metadata only — no embedding column
CREATE TABLE articles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    content      TEXT NOT NULL,
    url          TEXT UNIQUE NOT NULL,
    source       TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    fetched_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON articles (published_at DESC);

-- Embeddings live here, linked to articles
CREATE TABLE chunks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    chunk_text  TEXT NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    embedding   vector(1536),
    CONSTRAINT chunks_article_chunk_unique UNIQUE (article_id, chunk_index)
);

CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON chunks (article_id);
```

`vector(1536)` matches OpenAI `text-embedding-3-small` output dimensions.


### Redis
- Key: `query:cache:{sha256_of_question_lowercase}` → JSON-serialized answer
- TTL: 1800 seconds
- Used exclusively by Query Service

---


## Java / Spring Boot conventions (applies to all four backend services)

- **Java 21 features:** Use records for DTOs, pattern matching, text blocks, virtual threads
- **Config files:** `application.yaml` (not `.yml`) for all services
- **Spring AMQP:**
  - `@RabbitListener` for consumers
  - `RabbitTemplate.convertSendAndReceive()` for request/reply in the Gateway
  - `Jackson2JsonMessageConverter` as the message converter on all services — always construct it with the Spring Boot-configured `ObjectMapper` bean: `new Jackson2JsonMessageConverter(objectMapper)`. The no-arg constructor creates a vanilla `ObjectMapper` that serializes `Instant` as a numeric timestamp instead of ISO-8601 strings, which breaks frontend date rendering.
- **Spring Data / JPA:**
  - Use `spring-boot-starter-data-jpa` with Hibernate for all standard CRUD operations
  - **Exception — idempotent inserts:** Never use `existsByX + save` for deduplication. That pair is not atomic and throws `DataIntegrityViolationException` on a race, aborting the entire operation. Use a native `@Query` with `INSERT ... ON CONFLICT DO NOTHING` and check the returned row count instead:
    ```java
    @Transactional @Modifying
    @Query(value = "INSERT INTO ... ON CONFLICT (url) DO NOTHING", nativeQuery = true)
    int insertIfAbsent(...);
    ```
  - Use native JDBC (`JdbcTemplate`) for vector similarity search — Hibernate doesn't support pgvector natively
  - Use `pgvector-java` (`PGvector`) for the `vector(1536)` column type; call `PGvector.addVectorType(conn)` before preparing the statement
  - **pgvector recall:** Before every `<=>` cosine similarity query, execute `SET LOCAL ivfflat.probes = 10` on the same connection. The default of `probes = 1` with `lists = 100` searches only 1% of the index, giving very poor recall regardless of index quality.
- **Database migrations:** Flyway (`flyway-core` + `flyway-database-postgresql`) in all DB-touching services. Always `baseline-on-migrate: true`.
- **OpenAI calls:**
  - Use the official `openai-java` SDK
  - Wrap all OpenAI calls in try/catch — handle rate limits with exponential backoff
- **Redis:** `spring-boot-starter-data-redis` with `StringRedisTemplate` for simple key/value
- **Error handling:**
  - `@ControllerAdvice` + `@ExceptionHandler` in the Gateway (`GlobalExceptionHandler.java`) — never expose stack traces to frontend
  - RabbitMQ consumers: nack (not requeue) on unrecoverable errors so messages go to DLQ
- **Logging:** `slf4j` + `logback`, JSON output in production via `logstash-logback-encoder`
- **Configuration:** `application.yaml` for all services, secrets via environment variables only
- **DTOs:** Records for request/response objects. No entity classes in API layer.
- **Validation:** `@Valid` on all `@RequestBody` params. Use `@NotBlank`, `@Size` etc.

---

## Docker Compose

The compose setup is split into two files:

### `docker-compose.yml` — infrastructure only (base file)
Run this for local development alongside the Makefile.

- `rabbitmq` — `rabbitmq:3-management` (ports `127.0.0.1:5672` + `127.0.0.1:15672`)
- `postgres` — `pgvector/pgvector:pg16` (port `127.0.0.1:5432`)
- `redis` — `redis:7-alpine` (port `127.0.0.1:6379`)

All infra ports are bound to `127.0.0.1` to prevent public exposure even in dev.

### `docker-compose.prod.yml` — application services (production override)
Contains all four backend services + frontend, with production settings.
Applied on top of the base file: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`

- Build context for all Spring Boot services is `./services` with per-service Dockerfiles
- `restart: always` on all services
- `LOG_LEVEL=WARN`
- `JAVA_OPTS=-Xms128m -Xmx256m` per service (4 services × ~256MB = stays within 4GB)
- Infra ports (RabbitMQ 15672, Postgres 5432, Redis 6379) are removed via `ports: !reset []`
- API Gateway exposed on `0.0.0.0:8080`; frontend on `127.0.0.1:3000`

**All backend services must:**
- `depends_on` rabbitmq and postgres with `condition: service_healthy`
- Read secrets from environment variables (never hardcoded or in `application.yaml`)
- Log to stdout only
- Have a `/actuator/health` endpoint (Spring Boot Actuator) for healthchecks

---

## Project directory structure

```
newsmind/
├── CLAUDE.md
├── PLAN.md
├── README.md
├── Makefile                        ← local dev helper
├── docker-compose.yml              ← infra only (RabbitMQ, Postgres, Redis)
├── docker-compose.prod.yml         ← app services + prod settings
├── .env / .env.example
├── services/
│   ├── pom.xml                     ← Maven parent pom
│   ├── common/                     ← shared library (OpenAI client bean, EmbeddingClient)
│   ├── rss-fetcher/
│   ├── embedding-service/
│   ├── query-service/
│   └── api-gateway/
└── frontend/
```

Each service follows the same layout: `Dockerfile`, `pom.xml`, `src/main/java/com/newsmind/<service>/`, `src/main/resources/application.yaml`, and `src/main/resources/db/migration/` (Flyway V1–V4).

---


## Validation after code changes

After completing all code changes in a response, run tests once — not after each file edit.

- Changed one backend service → run the matching target: `make test-fetcher`, `make test-embedding`, `make test-query`, or `make test-gateway`
- Changed multiple backend services → run `make test`
- Changed frontend code → run `make test-frontend`

Some backend tests require infrastructure (DB, RabbitMQ). Run `make infra` first if not already up.

---

## Build and run commands

### Local development (Makefile)

The `Makefile` loads `.env` automatically via `-include .env` + `export`.

```bash
# Start infrastructure (RabbitMQ, Postgres, Redis) in Docker
make infra

# Start all 4 Spring Boot services + Vite frontend in parallel
make up

# Kill all running services and Vite
make down
```

`make up` runs each Spring Boot service via `./mvnw spring-boot:run` in the background,
then runs `npm run dev` in the foreground. Services use their fixed local ports:
- api-gateway: 8080
- rss-fetcher: 8081
- embedding-service: 8082
- query-service: 8083
- frontend (Vite): 5173

### Other useful commands

```bash
# Build a single service JAR
cd services/rss-fetcher && ./mvnw package -DskipTests

# Run tests for one service
cd services/query-service && ./mvnw test

# View RabbitMQ management UI (local dev)
open http://localhost:15672   # guest / guest

# Tail Docker logs (production)
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f query-service
```

---

## Key decisions and rationale

| Decision | Rationale |
|---|---|
| All-Java backend | Consistent JVM stack; easier to reason about across services; strong Spring Boot ecosystem for AMQP, scheduling, REST, Redis, JDBC |
| OpenAI `text-embedding-3-small` | 1536-dim, cheap (~$0.02/1M tokens), no local model serving needed |
| OpenAI `gpt-4o-mini` for generation | Cheapest OpenAI model with solid reasoning; ~$2–5/mo at this scale |
| PostgreSQL + pgvector | Fewer moving parts than a dedicated vector DB; handles our scale easily; single DB for both relational and vector data |
| `articles` + `chunks` split | Articles are pure metadata; embeddings live in `chunks`. Enables chunking strategies later without changing the articles table. |
| Flyway for migrations | Schema changes are versioned and reproducible; `baseline-on-migrate` allows safe adoption on existing DBs |
| RabbitMQ over Kafka | Simpler ops for a single-VM deployment; Spring AMQP is first-class; sufficient throughput for hourly RSS ingestion |
| JPA for CRUD, native JDBC for vectors | Standard ORM for relational operations; `JdbcTemplate` + `PGvector` for pgvector similarity search which Hibernate doesn't support natively |
| Redis TTL 30 minutes | Balance between answer freshness and OpenAI API cost |
| `docker-compose.yml` infra-only | Keeps local dev fast — run services with `make up` for hot-reload, use Docker only for infra |
| Spring Boot Actuator | Free `/actuator/health` endpoint for Docker healthchecks with zero extra code |

---
