package com.newsmind.query.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.newsmind.query.messaging.QueryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class QueryCache {

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Value("${query.cache-ttl-seconds}")
    private long cacheTtlSeconds;

    public Optional<QueryResponse> get(String question) {
        String key = cacheKey(question);
        String value = redis.opsForValue().get(key);
        if (value == null) return Optional.empty();
        try {
            return Optional.of(objectMapper.readValue(value, QueryResponse.class));
        } catch (Exception e) {
            log.warn("Failed to deserialize cached response for key {}: {}", key, e.getMessage());
            return Optional.empty();
        }
    }

    public void put(String question, QueryResponse response) {
        String key = cacheKey(question);
        try {
            String value = objectMapper.writeValueAsString(response);
            redis.opsForValue().set(key, value, Duration.ofSeconds(cacheTtlSeconds));
        } catch (Exception e) {
            log.warn("Failed to cache response for key {}: {}", key, e.getMessage());
        }
    }

    private String cacheKey(String question) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(question.toLowerCase(java.util.Locale.ROOT).getBytes(StandardCharsets.UTF_8));
            return "query:cache:" + HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
