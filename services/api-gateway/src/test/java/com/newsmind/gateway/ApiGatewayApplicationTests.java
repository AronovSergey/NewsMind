package com.newsmind.gateway;

import com.newsmind.gateway.service.QueryBrokerService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class ApiGatewayApplicationTests {

    @MockitoBean
    QueryBrokerService queryBrokerService;

    @Test
    void contextLoads() {
    }
}
