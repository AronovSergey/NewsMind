package com.newsmind.embedding.messaging;

import com.newsmind.embedding.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmbeddedArticlePublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publish(String url, String source) {
        var message = new EmbeddedMessage(url, source, Instant.now());
        rabbitTemplate.convertAndSend(RabbitMQConfig.NEWS_EMBEDDED_EXCHANGE, "", message);
        log.debug("Published embedded event for: {}", url);
    }
}
