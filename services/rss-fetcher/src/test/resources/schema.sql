CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS articles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    content      TEXT NOT NULL,
    url          TEXT UNIQUE NOT NULL,
    source       TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    fetched_at   TIMESTAMPTZ DEFAULT NOW(),
    embedding    vector(1536)
);

CREATE INDEX IF NOT EXISTS articles_embedding_idx
    ON articles USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE INDEX IF NOT EXISTS articles_published_at_idx
    ON articles (published_at DESC);
