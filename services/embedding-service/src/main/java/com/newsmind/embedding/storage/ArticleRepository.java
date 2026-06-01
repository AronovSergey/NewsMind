package com.newsmind.embedding.storage;

import com.pgvector.PGvector;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ArticleRepository {

    private final JdbcTemplate jdbcTemplate;

    public void updateEmbedding(String url, float[] embedding) {
        int updated = jdbcTemplate.update(conn -> {
            PGvector.addVectorType(conn);
            var ps = conn.prepareStatement(
                    "UPDATE articles SET embedding = ? WHERE url = ?");
            ps.setObject(1, new PGvector(embedding));
            ps.setString(2, url);
            return ps;
        });

        if (updated == 0) {
            log.warn("No article found for URL when storing embedding: {}", url);
        }
    }
}
