package com.newsmind.query.config;

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

    public static final String QUERY_REQUESTED_EXCHANGE = "query.requested";
    public static final String QUERY_REQUESTED_QUEUE = "query.requested.queue";
    public static final String QUERY_REQUESTED_DLQ = "query.requested.dlq";

    @Bean
    public DirectExchange queryRequestedExchange() {
        return new DirectExchange(QUERY_REQUESTED_EXCHANGE, true, false);
    }

    @Bean
    public Queue queryRequestedQueue() {
        return QueueBuilder.durable(QUERY_REQUESTED_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", QUERY_REQUESTED_DLQ)
                .build();
    }

    @Bean
    public Queue queryRequestedDlq() {
        return QueueBuilder.durable(QUERY_REQUESTED_DLQ).build();
    }

    @Bean
    public Binding queryRequestedBinding(Queue queryRequestedQueue, DirectExchange queryRequestedExchange) {
        return BindingBuilder.bind(queryRequestedQueue).to(queryRequestedExchange).with(QUERY_REQUESTED_QUEUE);
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
