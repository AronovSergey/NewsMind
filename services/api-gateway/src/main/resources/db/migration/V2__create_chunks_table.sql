CREATE TABLE chunks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    chunk_text  TEXT NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    embedding   vector(1536),
    CONSTRAINT chunks_article_chunk_unique UNIQUE (article_id, chunk_index)
);

CREATE INDEX chunks_embedding_idx
    ON chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE INDEX chunks_article_id_idx ON chunks (article_id);
