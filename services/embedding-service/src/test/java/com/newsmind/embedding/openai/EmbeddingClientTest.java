package com.newsmind.embedding.openai;

import com.openai.client.OpenAIClient;
import com.openai.models.embeddings.CreateEmbeddingResponse;
import com.openai.models.embeddings.Embedding;
import com.openai.models.embeddings.EmbeddingCreateParams;
import com.openai.services.blocking.EmbeddingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmbeddingClientTest {

    @InjectMocks
    private EmbeddingClient embeddingClient;

    @Mock
    private OpenAIClient openAIClient;

    @Mock
    private EmbeddingService embeddingService;

    @Mock
    private CreateEmbeddingResponse embeddingResponse;

    @Mock
    private Embedding embedding;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(embeddingClient, "apiKey", "test-key");
        ReflectionTestUtils.setField(embeddingClient, "embeddingModel", "text-embedding-3-small");
        ReflectionTestUtils.setField(embeddingClient, "client", openAIClient);
    }

    @Test
    void embed_returnsVectorOf1536Dimensions() {
        List<Double> fakeEmbedding = new ArrayList<>();
        for (int i = 0; i < 1536; i++) {
            fakeEmbedding.add((double) i * 0.001);
        }

        when(openAIClient.embeddings()).thenReturn(embeddingService);
        when(embeddingService.create(any(EmbeddingCreateParams.class))).thenReturn(embeddingResponse);
        when(embeddingResponse.data()).thenReturn(List.of(embedding));
        when(embedding.embedding()).thenReturn(fakeEmbedding);

        float[] result = embeddingClient.embed("test article text");

        assertThat(result).hasSize(1536);
        assertThat(result[1]).isGreaterThan(0f);
    }
}
