INSERT INTO chunks (article_id, chunk_text, chunk_index, embedding)
SELECT id, content, 0, embedding
FROM articles
WHERE embedding IS NOT NULL
ON CONFLICT (article_id, chunk_index) DO NOTHING;
