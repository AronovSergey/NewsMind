package com.newsmind.embedding.messaging;

import com.newsmind.common.openai.EmbeddingClient;
import com.newsmind.embedding.config.RabbitMQConfig;
import com.newsmind.embedding.storage.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleConsumer {

    private final EmbeddingClient embeddingClient;
    private final ArticleRepository articleRepository;
    private final EmbeddedArticlePublisher publisher;

    @RabbitListener(queues = RabbitMQConfig.NEWS_FETCHED_QUEUE)
    public void consume(ArticleMessage article) {
        log.info("Embedding article: {}", article.url());
        try {
            String text = article.title() + "\n" + article.content();
            float[] embedding = embeddingClient.embed(text);
            articleRepository.updateEmbedding(article.url(), embedding);
            publisher.publish(article.url(), article.source());
            log.info("Embedded article ({} dims): {}", embedding.length, article.url());
        } catch (Exception e) {
            log.error("Failed to embed article {}: {}", article.url(), e.getMessage(), e);
            throw new AmqpRejectAndDontRequeueException("Embedding failed for: " + article.url(), e);
        }
    }
}
