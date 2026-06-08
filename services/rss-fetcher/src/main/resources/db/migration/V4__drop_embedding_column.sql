DROP INDEX IF EXISTS articles_embedding_idx;
ALTER TABLE articles DROP COLUMN IF EXISTS embedding;
