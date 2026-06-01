package com.newsmind.fetcher.messaging;

import com.newsmind.fetcher.config.RabbitMQConfig;
import com.newsmind.fetcher.feed.RawArticle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticlePublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publish(RawArticle article) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.NEWS_FETCHED_EXCHANGE, "", article);
        log.debug("Published article: {}", article.url());
    }
}
