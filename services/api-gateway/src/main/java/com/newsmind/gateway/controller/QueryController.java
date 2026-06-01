package com.newsmind.gateway.controller;

import com.newsmind.gateway.model.QueryRequest;
import com.newsmind.gateway.model.QueryResponse;
import com.newsmind.gateway.service.QueryBrokerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QueryController {

    private final QueryBrokerService queryBrokerService;
    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/ask")
    public ResponseEntity<QueryResponse> ask(@Valid @RequestBody QueryRequest request) {
        QueryResponse response = queryBrokerService.ask(request.question());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "api-gateway"));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Long totalArticles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM articles", Long.class);
        Long embeddedArticles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM articles WHERE embedding IS NOT NULL", Long.class);
        Instant lastFetch = jdbcTemplate.queryForObject(
                "SELECT MAX(fetched_at) FROM articles", Instant.class);

        return ResponseEntity.ok(Map.of(
                "totalArticles", totalArticles != null ? totalArticles : 0,
                "embeddedArticles", embeddedArticles != null ? embeddedArticles : 0,
                "lastFetchedAt", lastFetch != null ? lastFetch.toString() : "never"
        ));
    }
}
