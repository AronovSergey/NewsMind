package com.newsmind.fetcher.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {

    boolean existsByUrl(String url);

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO articles (title, content, url, source, published_at)
            VALUES (:title, :content, :url, :source, :publishedAt)
            ON CONFLICT (url) DO NOTHING
            """, nativeQuery = true)
    int insertIfAbsent(@Param("title") String title,
                       @Param("content") String content,
                       @Param("url") String url,
                       @Param("source") String source,
                       @Param("publishedAt") Instant publishedAt);
}
