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

Claude Code must NOT generate boilerplate or initial project files for the following —
these are created manually via CLI before Claude touches them:

| What | How to scaffold it | Then tell Claude |
|---|---|---|
| React frontend | `npm create vite@latest frontend -- --template react-ts` | "Frontend is scaffolded, continue from here" |
| Spring Boot services | Spring Initializr (start.spring.io) or IntelliJ new project wizard | "Service skeleton is ready, continue from here" |

### What Claude Code SHOULD do after scaffolding
- Add dependencies to existing `pom.xml` or `package.json`
- Create source files inside the already-existing `src/` structure
- Edit config files (`application.yml`, `vite.config.ts`, `tailwind.config.ts`, etc.)
- Write `Dockerfile` and `docker-compose.yml` entries

### What Claude Code must NEVER do
- Run `npm create`, `npx create-*`, `spring init`, or any project-generator command
- Generate a `src/` folder from scratch when one doesn't already exist
- Create `pom.xml` or `package.json` from scratch — always edit the existing one

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
   │   Articles + embeddings   │    │   Query cache    │
   └───────────────────────────┘    └─────────────────┘
```

---

## Services — one job per service

All four backend services share the same technology: **Java 21 + Spring Boot 3**.
Each is its own Maven/Gradle project with its own Dockerfile.

### 1. RSS Fetcher (`/services/rss-fetcher/`)
- **Job:** Pull articles from RSS feeds on a schedule, deduplicate, publish to RabbitMQ
- **Trigger:** `@Scheduled(fixedDelay = 3600000)` — every 60 minutes
- **Publishes:** `news.fetched` exchange
- **Consumes:** Nothing
- **Key dependencies:** `spring-boot-starter-amqp`, `rome` (RSS parsing), `spring-boot-starter-jdbc`
- **RSS feeds:**
  - BBC News: `http://feeds.bbci.co.uk/news/rss.xml`
  - TechCrunch: `https://techcrunch.com/feed/`
  - Reuters: `https://feeds.reuters.com/reuters/topNews`
  - The Verge: `https://www.theverge.com/rss/index.xml`
  - Hacker News: `https://hnrss.org/frontpage`
  - Al Jazeera: `https://www.aljazeera.com/xml/rss/all.xml`
- **Dedup strategy:** Store article URLs in PostgreSQL; skip any URL already present

### 2. Embedding Service (`/services/embedding-service/`)
- **Job:** Consume fetched articles, generate vector embeddings via OpenAI, store in pgvector
- **Trigger:** RabbitMQ message on `news.fetched`
- **Consumes:** `news.fetched`
- **Publishes:** `news.embedded`
- **Embedding model:** OpenAI `text-embedding-3-small` (1536 dimensions, ~$0.02/1M tokens)
- **Key dependencies:** `spring-boot-starter-amqp`, `spring-ai-openai` or `openai-java`, `spring-boot-starter-jdbc`, `pgvector-java`
- **Flow:** receive message → call OpenAI embeddings API → write article + vector to PostgreSQL

### 3. Query / RAG Service (`/services/query-service/`)
- **Job:** Receive user questions, run semantic search, generate LLM answers, return results
- **Trigger:** RabbitMQ message on `query.requested`
- **Consumes:** `query.requested`
- **Publishes:** `query.answered` (reply to Gateway's correlation ID)
- **Key dependencies:** `spring-boot-starter-amqp`, `spring-ai-openai` or `openai-java`, `spring-boot-starter-data-redis`, `spring-boot-starter-jdbc`, `pgvector-java`
- **RAG flow:**
  1. Check Redis cache by SHA-256 hash of the question — return cached answer if found
  2. Embed the user question using `text-embedding-3-small`
  3. Query pgvector for top-5 most similar articles (cosine similarity)
  4. Build a prompt with retrieved context + user question (see template below)
  5. Call OpenAI `gpt-4o-mini` for generation
  6. Cache the answer in Redis (TTL: 1800s)
  7. Publish answer + source metadata to `query.answered`
- **LLM:** OpenAI `gpt-4o-mini`

### 4. API Gateway (`/services/api-gateway/`)
- **Job:** Expose REST API to the frontend, bridge HTTP↔RabbitMQ, handle validation
- **Key dependencies:** `spring-boot-starter-web`, `spring-boot-starter-amqp`, `spring-boot-starter-validation`, `lombok`
- **Endpoints:**
  - `POST /api/ask` — accepts `{ "question": "..." }`, publishes to RabbitMQ, blocks on reply
  - `GET /api/health` — health status of all downstream services
  - `GET /api/status` — articles indexed count, last fetch timestamp
- **RabbitMQ pattern:** Request/Reply using `RabbitTemplate.convertSendAndReceive()` with correlation IDs
- **Timeout:** 30 seconds — return `504` with a friendly message if exceeded
- **CORS:** configured for React frontend origin in all environments

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

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE articles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    content      TEXT NOT NULL,
    url          TEXT UNIQUE NOT NULL,
    source       TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    fetched_at   TIMESTAMPTZ DEFAULT NOW(),
    embedding    vector(1536)
);

CREATE INDEX ON articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON articles (published_at DESC);
```

Note: `vector(1536)` matches OpenAI `text-embedding-3-small` output dimensions.
The previous Python version used 384-dim (`all-MiniLM-L6-v2`) — this schema uses 1536.

### Redis
- Key: `query:cache:{sha256_of_question_lowercase}` → JSON-serialized answer
- TTL: 1800 seconds
- Used exclusively by Query Service

---

## RAG prompt template

Use this in `QueryService.java` (or a dedicated `PromptBuilder` component):

```java
private static final String SYSTEM_PROMPT = """
    You are NewsMind, a helpful news assistant.
    You answer questions about current events based only on the provided news articles.
    Always be factual, concise, and neutral in tone.
    If the provided articles don't contain enough information to answer the question,
    say so honestly rather than speculating.
    Your audience includes non-technical professionals — avoid jargon.
    """;

public String buildUserPrompt(String question, List<ArticleContext> articles) {
    StringBuilder sb = new StringBuilder();
    sb.append("Answer the following question using only the news articles below.\n");
    sb.append("At the end of your answer, list which article numbers you used as sources.\n\n");
    sb.append("Question: ").append(question).append("\n\nArticles:\n");
    for (int i = 0; i < articles.size(); i++) {
        ArticleContext a = articles.get(i);
        sb.append(String.format("[%d] %s (%s)%n%s%n%s%n%n",
            i + 1, a.source(), a.publishedAt(), a.title(),
            a.content().substring(0, Math.min(500, a.content().length()))
        ));
    }
    sb.append("Answer:");
    return sb.toString();
}
```

---

## Java / Spring Boot conventions (applies to all four backend services)

- **Java 21 features:** Use records for DTOs, pattern matching, text blocks, virtual threads
- **Spring AMQP:**
  - `@RabbitListener` for consumers
  - `RabbitTemplate.convertSendAndReceive()` for request/reply in the Gateway
  - `Jackson2JsonMessageConverter` as the message converter on all services — messages are JSON
- **Spring Data / JDBC:**
  - Use `JdbcClient` (Spring 6.1+) or `NamedParameterJdbcTemplate` for PostgreSQL queries
  - Use `pgvector-java` for vector type support
  - No JPA/Hibernate — direct JDBC is simpler and more transparent for this workload
- **OpenAI calls:**
  - Use `spring-ai-openai` starter if on Spring AI, otherwise the official `openai-java` SDK
  - Wrap all OpenAI calls in try/catch — handle rate limits with exponential backoff
- **Redis:** `spring-boot-starter-data-redis` with `StringRedisTemplate` for simple key/value
- **Error handling:**
  - `@ControllerAdvice` + `@ExceptionHandler` in the Gateway — never expose stack traces to frontend
  - RabbitMQ consumers: nack (not requeue) on unrecoverable errors so messages go to DLQ
- **Logging:** `slf4j` + `logback`, JSON output in production via `logstash-logback-encoder`
- **Configuration:** `application.yml` for all services, secrets via environment variables only
- **DTOs:** Records for request/response objects. No entity classes in API layer.
- **Validation:** `@Valid` on all `@RequestBody` params. Use `@NotBlank`, `@Size` etc.

---

## Docker Compose

All services orchestrated via Docker Compose for local dev and production.

**File:** `docker-compose.yml` at project root.

**Services:**
- `rabbitmq` — `rabbitmq:3-management` (ports 5672 + 15672 for management UI)
- `postgres` — `pgvector/pgvector:pg16` (includes pgvector extension pre-installed)
- `redis` — `redis:7-alpine`
- `rss-fetcher` — built from `./services/rss-fetcher/Dockerfile`
- `embedding-service` — built from `./services/embedding-service/Dockerfile`
- `query-service` — built from `./services/query-service/Dockerfile`
- `api-gateway` — built from `./services/api-gateway/Dockerfile`
- `frontend` — built from `./frontend/Dockerfile` (nginx serving Vite build)

**All backend services must:**
- `depends_on` rabbitmq and postgres with `condition: service_healthy`
- Read secrets from environment variables (never hardcoded or in `application.yml`)
- Log to stdout only
- Have a `/actuator/health` endpoint (Spring Boot Actuator) for healthchecks

**Dockerfile pattern for Spring Boot services:**
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## Project directory structure

```
newsmind/
├── CLAUDE.md
├── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
│
├── services/
│   ├── rss-fetcher/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/newsmind/fetcher/
│   │       ├── FetcherApplication.java
│   │       ├── scheduler/FetchScheduler.java       ← @Scheduled entry point
│   │       ├── feed/FeedParser.java                ← Rome RSS parsing
│   │       ├── feed/ArticleDeduplicator.java       ← URL-based dedup via DB
│   │       └── messaging/ArticlePublisher.java     ← RabbitMQ publish
│   │
│   ├── embedding-service/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/newsmind/embedding/
│   │       ├── EmbeddingApplication.java
│   │       ├── messaging/ArticleConsumer.java      ← @RabbitListener
│   │       ├── openai/EmbeddingClient.java         ← OpenAI API call
│   │       └── storage/ArticleRepository.java      ← pgvector write
│   │
│   ├── query-service/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/newsmind/query/
│   │       ├── QueryApplication.java
│   │       ├── messaging/QueryConsumer.java        ← @RabbitListener
│   │       ├── messaging/AnswerPublisher.java      ← reply to Gateway
│   │       ├── rag/VectorRetriever.java            ← pgvector similarity search
│   │       ├── rag/PromptBuilder.java              ← builds LLM prompt
│   │       ├── rag/LlmClient.java                  ← OpenAI GPT-4o-mini call
│   │       └── cache/QueryCache.java               ← Redis read/write
│   │
│   └── api-gateway/
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/main/java/com/newsmind/gateway/
│           ├── GatewayApplication.java
│           ├── controller/QueryController.java
│           ├── service/QueryBrokerService.java     ← RabbitMQ request/reply
│           ├── model/QueryRequest.java             ← record
│           ├── model/QueryResponse.java            ← record
│           └── config/
│               ├── RabbitMQConfig.java
│               └── CorsConfig.java
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── SearchBar.tsx
        │   ├── AnswerCard.tsx
        │   ├── SourceCard.tsx
        │   └── LoadingSkeleton.tsx
        ├── hooks/useAsk.ts
        └── types/index.ts
```

---

## Environment variables

### All backend services
```
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
POSTGRES_URL=jdbc:postgresql://postgres:5432/newsmind
POSTGRES_USERNAME=newsmind
POSTGRES_PASSWORD=newsmind
LOG_LEVEL=INFO
```

### Embedding Service + Query Service
```
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o-mini
```

### Query Service only
```
REDIS_HOST=redis
REDIS_PORT=6379
MAX_CONTEXT_ARTICLES=5
QUERY_CACHE_TTL_SECONDS=1800
```

### API Gateway only
```
QUERY_TIMEOUT_SECONDS=30
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://newsmind.yourdomain.com
```

### Frontend (Vite build args)
```
VITE_API_BASE_URL=http://localhost:8080
```

---

## Build and run commands

```bash
# Start everything locally
docker compose up --build

# Start infrastructure only (RabbitMQ, Postgres, Redis)
docker compose up rabbitmq postgres redis

# Build a single service
cd services/rss-fetcher && ./mvnw package -DskipTests

# Rebuild one Docker service after code change
docker compose up --build rss-fetcher

# View RabbitMQ management UI
open http://localhost:15672   # guest / guest

# Tail all logs
docker compose logs -f

# Tail one service
docker compose logs -f query-service

# Run tests for one service
cd services/query-service && ./mvnw test
```

---

## Deployment (production)

**Target:** Hetzner CX21 VM (2 vCPU, 4GB RAM, ~€5/month)

**Steps:**
1. SSH into VM, install Docker + Docker Compose
2. Clone repo, copy `.env` with production values
3. `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
4. Nginx on the host (not in Docker) reverse-proxies 80/443 → 8080 (gateway) and serves the frontend static build
5. Certbot for HTTPS

**`docker-compose.prod.yml` overrides:**
- No exposed ports for RabbitMQ management UI (15672) or Postgres (5432)
- `restart: always` on all services
- `LOG_LEVEL=WARN` for all services
- JVM memory flags: `JAVA_OPTS=-Xms128m -Xmx256m` per service to stay within 4GB total

---

## Key decisions and rationale

| Decision | Rationale |
|---|---|
| All-Java backend | Consistent JVM stack; easier to reason about across services; strong Spring Boot ecosystem for AMQP, scheduling, REST, Redis, JDBC |
| OpenAI `text-embedding-3-small` | Replaces Python sentence-transformers; 1536-dim, cheap (~$0.02/1M tokens), no local model serving needed |
| OpenAI `gpt-4o-mini` for generation | Cheapest OpenAI model with solid reasoning; ~$2–5/mo at this scale |
| PostgreSQL + pgvector | Fewer moving parts than a dedicated vector DB; handles our scale easily; single DB for both relational and vector data |
| RabbitMQ over Kafka | Simpler ops for a single-VM deployment; Spring AMQP is first-class; sufficient throughput for hourly RSS ingestion |
| No JPA/Hibernate | Direct JDBC is more transparent for vector operations and avoids ORM complexity |
| Redis TTL 30 minutes | Balance between answer freshness and OpenAI API cost |
| Spring Boot Actuator | Free `/actuator/health` endpoint for Docker healthchecks with zero extra code |

---

## What done looks like (Definition of Done)

- [ ] `docker compose up --build` starts all 9 containers with no errors
- [ ] RabbitMQ management UI shows all expected exchanges and queues
- [ ] RSS Fetcher pulls articles on schedule and they appear in PostgreSQL
- [ ] Embedding Service stores vector embeddings (check `embedding IS NOT NULL` in DB)
- [ ] `POST /api/ask` returns a sourced answer within 30 seconds
- [ ] Frontend is usable by a non-technical person without explanation
- [ ] The deployed URL is publicly accessible over HTTPS
- [ ] README has architecture diagram, setup instructions, and a demo GIF or video link
- [ ] All secrets in `.env`, nothing hardcoded in source or `application.yml`
- [ ] Each service has at least one unit test and one integration test

---