package com.newsmind.query.rag;

import com.pgvector.PGvector;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class VectorRetriever {

    private final JdbcTemplate jdbcTemplate;

    @Value("${query.max-context-articles}")
    private int maxContextArticles;

    public List<ArticleContext> findSimilar(float[] questionEmbedding) {
        return jdbcTemplate.query(conn -> {
            PGvector.addVectorType(conn);
            var ps = conn.prepareStatement("""
                    SELECT title, content, url, source, published_at
                    FROM articles
                    WHERE embedding IS NOT NULL
                    ORDER BY embedding <=> ?
                    LIMIT ?
                    """);
            ps.setObject(1, new PGvector(questionEmbedding));
            ps.setInt(2, maxContextArticles);
            return ps;
        }, (rs, rowNum) -> new ArticleContext(
                rs.getString("title"),
                rs.getString("content"),
                rs.getString("url"),
                rs.getString("source"),
                rs.getTimestamp("published_at") != null
                        ? rs.getTimestamp("published_at").toInstant()
                        : null
        ));
    }
}
