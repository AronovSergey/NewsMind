package com.newsmind.fetcher.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NEWS_FETCHED_EXCHANGE = "news.fetched";
    public static final String NEWS_FETCHED_QUEUE = "news.fetched.queue";
    public static final String NEWS_FETCHED_DLQ = "news.fetched.dlq";

    @Bean
    public FanoutExchange newsFetchedExchange() {
        return new FanoutExchange(NEWS_FETCHED_EXCHANGE, true, false);
    }

    @Bean
    public Queue newsFetchedQueue() {
        return QueueBuilder.durable(NEWS_FETCHED_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", NEWS_FETCHED_DLQ)
                .build();
    }

    @Bean
    public Queue newsFetchedDlq() {
        return QueueBuilder.durable(NEWS_FETCHED_DLQ).build();
    }

    @Bean
    public Binding newsFetchedBinding(Queue newsFetchedQueue, FanoutExchange newsFetchedExchange) {
        return BindingBuilder.bind(newsFetchedQueue).to(newsFetchedExchange);
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public ApplicationRunner declareRabbitEntities(RabbitAdmin rabbitAdmin) {
        return args -> rabbitAdmin.initialize();
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
