package com.newsmind.embedding;

import com.newsmind.embedding.messaging.ArticleConsumer;
import com.newsmind.common.openai.EmbeddingClient;
import com.openai.client.OpenAIClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class EmbeddingServiceApplicationTests {

    @MockitoBean
    ArticleConsumer articleConsumer;

    @MockitoBean
    EmbeddingClient embeddingClient;

    @MockitoBean
    OpenAIClient openAIClient;

    @Test
    void contextLoads() {
    }
}
