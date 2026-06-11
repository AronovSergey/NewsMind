CREATE TABLE fetch_runs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at  TIMESTAMPTZ,
    total_fetched INT NOT NULL DEFAULT 0,
    total_new     INT NOT NULL DEFAULT 0
);

CREATE INDEX ON fetch_runs (started_at DESC);

CREATE TABLE fetch_run_sources (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fetch_run_id UUID NOT NULL REFERENCES fetch_runs(id) ON DELETE CASCADE,
    source_name  TEXT NOT NULL,
    fetched      INT NOT NULL DEFAULT 0,
    new_articles INT NOT NULL DEFAULT 0
);

CREATE INDEX ON fetch_run_sources (fetch_run_id);
