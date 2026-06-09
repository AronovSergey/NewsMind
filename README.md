# NewsMind

A distributed news intelligence platform. Ask natural language questions about current events and get accurate, sourced answers in real time.

> "What happened in AI this week?" → synthesized answer with source links, powered by live RSS feeds and a RAG pipeline.

**Live demo:** [newsmind.media](https://newsmind.media)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend (Vite + TS)          │
└──────────────────────┬──────────────────────┘
                       │ REST (HTTP)
┌──────────────────────▼──────────────────────┐
│         Spring Boot API Gateway             │
└──────────────────────┬──────────────────────┘
                       │
              ┌────────▼────────┐
              │    RabbitMQ     │
              └──┬──────────┬───┘
                 │          │
   ┌─────────────▼─┐   ┌────▼──────────┐   ┌──▼─────────────┐
   │  RSS Fetcher  │   │ Embedding Svc │   │ Query/RAG Svc  │
   └───────┬───────┘   └──────┬────────┘   └──────┬─────────┘
           │                  │                    │
   ┌───────▼──────────────────▼──┐      ┌──────────▼──────┐
   │   PostgreSQL + pgvector     │      │      Redis       │
   │   Articles + embeddings     │      │   Query cache    │
   └─────────────────────────────┘      └─────────────────┘
```

**Key architectural decisions:**
- All backend services communicate exclusively via RabbitMQ — no direct HTTP calls between services
- Vector similarity search via pgvector instead of a dedicated vector database — fewer moving parts
- All four backend services are Java 21 + Spring Boot 3 — consistent JVM stack throughout

---

## How it works

1. **RSS Fetcher** — pulls articles from 6 news sources every hour, deduplicates by URL, publishes to RabbitMQ
2. **Embedding Service** — consumes articles, generates 1536-dim vectors via OpenAI `text-embedding-3-small`, stores in pgvector
3. **Query Service** — receives user questions, runs cosine similarity search, builds a RAG prompt, calls `gpt-4o-mini`, caches answers in Redis
4. **API Gateway** — bridges the React frontend (REST) with the backend (RabbitMQ request/reply)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Java 21 + Spring Boot 3 (4 microservices) |
| Messaging | RabbitMQ (fanout + direct exchanges, dead-letter queues) |
| Database | PostgreSQL 16 + pgvector |
| Cache | Redis 7 |
| AI | OpenAI `text-embedding-3-small` + `gpt-4o-mini` |
| Infra | Docker Compose, Hetzner CX21 (2 vCPU, 4GB RAM) |
| HTTPS | Let's Encrypt via Certbot, auto-renewed |
| CI/CD | GitHub Actions — build + SSH deploy to VM on push to main |

---

## Running locally

**Prerequisites:** Docker, Docker Compose, Java 21, Node.js, an OpenAI API key.

1. Clone the repo and copy the example env file:
   ```bash
   git clone https://github.com/AronovSergey/NewsMind.git
   cd NewsMind
   cp .env.example .env
   # fill in OPENAI_API_KEY in .env
   ```

2. Start the infrastructure (RabbitMQ, PostgreSQL, Redis):
   ```bash
   docker compose up -d
   ```

3. Start all services and the frontend:
   ```bash
   make up
   ```

4. Open `http://localhost:5173` in your browser.

To stop everything:
```bash
make down
```

**Useful URLs while running locally:**
| URL | What |
|---|---|
| `http://localhost:5173` | Frontend (Vite dev server) |
| `http://localhost:8080` | API Gateway |
| `http://localhost:15672` | RabbitMQ management UI (guest / guest) |
| `http://localhost:5432` | PostgreSQL |

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key — used for embeddings and GPT-4o-mini |
| `LOG_LEVEL` | No | Log verbosity — `INFO` (default) or `WARN` for production |
| `JAVA_OPTS` | No | JVM memory flags — default `-Xms128m -Xmx256m` per service |

---

## Project structure

```
newsmind/
├── services/
│   ├── rss-fetcher/        — Spring Boot, Rome RSS, @Scheduled
│   ├── embedding-service/  — Spring Boot, OpenAI embeddings, pgvector
│   ├── query-service/      — Spring Boot, RAG pipeline, Redis cache
│   └── api-gateway/        — Spring Boot, REST API, RabbitMQ request/reply
├── frontend/               — React + TypeScript + TailwindCSS
├── docker-compose.yml      — infrastructure only (RabbitMQ, PostgreSQL, Redis)
├── docker-compose.prod.yml — production app services + overrides
├── Makefile                — local dev commands (make up / make down)
└── .env.example            — environment variable template
```

---

## RSS news sources

- BBC News
- TechCrunch
- The Verge
- Hacker News
- NPR News
- NY Times
