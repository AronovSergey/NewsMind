package com.newsmind.query.messaging;

import com.newsmind.query.cache.QueryCache;
import com.newsmind.query.config.RabbitMQConfig;
import com.newsmind.query.rag.ArticleContext;
import com.newsmind.query.rag.EmbeddingClient;
import com.newsmind.query.rag.LlmClient;
import com.newsmind.query.rag.PromptBuilder;
import com.newsmind.query.rag.VectorRetriever;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class QueryConsumer {

    private final EmbeddingClient embeddingClient;
    private final VectorRetriever vectorRetriever;
    private final PromptBuilder promptBuilder;
    private final LlmClient llmClient;
    private final QueryCache queryCache;

    @RabbitListener(queues = RabbitMQConfig.QUERY_REQUESTED_QUEUE)
    public QueryResponse consume(QueryRequest request) {
        String question = request.question();
        log.info("Received query: {}", question);

        try {
            return queryCache.get(question).orElseGet(() -> {
                float[] questionEmbedding = embeddingClient.embed(question);
                List<ArticleContext> articles = vectorRetriever.findSimilar(questionEmbedding);

                log.info("Retrieved {} articles for query", articles.size());

                String userPrompt = promptBuilder.buildUserPrompt(question, articles);
                String answer = llmClient.complete(PromptBuilder.SYSTEM_PROMPT, userPrompt);

                List<SourceDto> sources = articles.stream()
                        .map(a -> new SourceDto(a.title(), a.url(), a.source(), a.publishedAt()))
                        .toList();

                QueryResponse response = new QueryResponse(answer, sources);
                queryCache.put(question, response);
                return response;
            });
        } catch (Exception e) {
            log.error("Failed to process query '{}': {}", question, e.getMessage(), e);
            throw new AmqpRejectAndDontRequeueException("Query processing failed: " + question, e);
        }
    }
}
