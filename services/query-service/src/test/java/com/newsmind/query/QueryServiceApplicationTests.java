package com.newsmind.query;

import com.newsmind.query.messaging.QueryConsumer;
import com.newsmind.query.rag.EmbeddingClient;
import com.newsmind.query.rag.LlmClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class QueryServiceApplicationTests {

    @MockitoBean
    QueryConsumer queryConsumer;

    @MockitoBean
    EmbeddingClient embeddingClient;

    @MockitoBean
    LlmClient llmClient;

    @Test
    void contextLoads() {
    }
}
