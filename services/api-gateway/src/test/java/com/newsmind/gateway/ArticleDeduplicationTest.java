package com.newsmind.gateway;

import com.newsmind.gateway.service.QueryBrokerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class ArticleDeduplicationTest {

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
    QueryBrokerService queryBrokerService;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void insertSameUrlTwice_onlyOneRowInDb() {
        String url = "https://example.com/test-" + System.currentTimeMillis();

        int first = jdbcTemplate.update(
                "INSERT INTO articles (title, content, url, source) VALUES (?, ?, ?, ?) ON CONFLICT (url) DO NOTHING",
                "Title", "Content", url, "TestSource");
        int second = jdbcTemplate.update(
                "INSERT INTO articles (title, content, url, source) VALUES (?, ?, ?, ?) ON CONFLICT (url) DO NOTHING",
                "Title", "Content", url, "TestSource");

        assertThat(first).isEqualTo(1);
        assertThat(second).isEqualTo(0);

        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM articles WHERE url = ?", Long.class, url);
        assertThat(count).isEqualTo(1);
    }
}
