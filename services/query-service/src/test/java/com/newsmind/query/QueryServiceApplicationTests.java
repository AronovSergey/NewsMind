package com.newsmind.query;

import com.newsmind.query.messaging.QueryConsumer;
import com.newsmind.common.openai.EmbeddingClient;
import com.newsmind.query.rag.LlmClient;
import com.openai.client.OpenAIClient;
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

    @MockitoBean
    OpenAIClient openAIClient;

    @Test
    void contextLoads() {
    }
}
