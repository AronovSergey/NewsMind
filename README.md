# NewsMind

A distributed news intelligence platform. Ask natural language questions about current events and get accurate, sourced answers in real time.

> "What happened in AI this week?" → synthesized answer with source links, powered by live RSS feeds and a RAG pipeline.

---

## How it works

1. **RSS Fetcher** pulls articles from 6 news sources every hour
2. **Embedding Service** converts articles into vector embeddings via OpenAI
3. **Query Service** runs semantic search + GPT-4o-mini to answer your question
4. **API Gateway** exposes a REST API to the React frontend

All backend communication is async via RabbitMQ. The only REST interface is the frontend ↔ Gateway.

```
React Frontend
      │ REST
API Gateway
      │
   RabbitMQ
   ┌──┴──────────┬─────────────┐
RSS Fetcher  Embedding Svc  Query Svc
      └──────────┴─────────────┘
               PostgreSQL + pgvector   Redis
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Java 21 + Spring Boot 3 (4 services) |
| Messaging | RabbitMQ |
| Database | PostgreSQL + pgvector |
| Cache | Redis |
| AI | OpenAI `text-embedding-3-small` + `gpt-4o-mini` |
| Infra | Docker Compose, Hetzner CX21 |

## Running locally

**Prerequisites:** Docker, Docker Compose, an OpenAI API key.

1. Clone the repo and copy the example env file:
   ```bash
   git clone https://github.com/AronovSergey/NewsMind.git
   cd NewsMind
   cp .env.example .env
   # fill in OPENAI_API_KEY in .env
   ```

2. Start everything:
   ```bash
   docker compose up --build
   ```

3. Open `http://localhost:3000` in your browser.

**Useful URLs while running locally:**
- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- RabbitMQ management UI: `http://localhost:15672` (guest / guest)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key — used for embeddings and GPT-4o-mini |
| `LOG_LEVEL` | No | Log verbosity — `INFO` (default) or `WARN` for production |
| `JAVA_OPTS` | No | JVM memory flags — default `-Xms128m -Xmx256m` per service |

## Project status

Under active development. See [PLAN.md](PLAN.md) for the full build plan.
