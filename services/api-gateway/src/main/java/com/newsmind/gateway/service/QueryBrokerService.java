package com.newsmind.gateway.service;

import com.newsmind.gateway.config.RabbitMQConfig;
import com.newsmind.gateway.model.QueryRequest;
import com.newsmind.gateway.model.QueryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryBrokerService {

    private final RabbitTemplate rabbitTemplate;

    public QueryResponse ask(String question) {
        log.info("Sending query to RabbitMQ: {}", question);

        QueryResponse response = rabbitTemplate.convertSendAndReceiveAsType(
                RabbitMQConfig.QUERY_REQUESTED_EXCHANGE,
                RabbitMQConfig.QUERY_REQUESTED_ROUTING_KEY,
                new QueryRequest(question),
                new ParameterizedTypeReference<>() {}
        );

        if (response == null) {
            log.warn("Query timed out for question: {}", question);
            throw new QueryTimeoutException("The request timed out — please try again in a moment.");
        }

        return response;
    }
}
