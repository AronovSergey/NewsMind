package com.newsmind.fetcher.feed;

import com.newsmind.fetcher.domain.ArticleRepository;
import com.newsmind.fetcher.scheduler.FetchScheduler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class ArticleDeduplicatorTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("pgvector/pgvector:pg16"))
            .withDatabaseName("newsmind")
            .withUsername("newsmind")
            .withPassword("newsmind");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @MockitoBean
    FetchScheduler fetchScheduler;

    @Autowired
    ArticleDeduplicator deduplicator;

    @Autowired
    ArticleRepository articleRepository;

    @Test
    void insertSameArticleTwice_onlyOneRowInDb() {
        RawArticle article = new RawArticle(
                "Test Title", "Test content",
                "https://example.com/unique-article-" + System.currentTimeMillis(),
                "Test Source", Instant.now()
        );

        List<RawArticle> firstInsert = deduplicator.insertNew(List.of(article));
        List<RawArticle> secondInsert = deduplicator.insertNew(List.of(article));

        assertThat(firstInsert).hasSize(1);
        assertThat(secondInsert).isEmpty();
        assertThat(articleRepository.existsByUrl(article.url())).isTrue();
    }
}
