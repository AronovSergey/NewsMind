package com.newsmind.fetcher.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "feeds")
public record FeedsConfig(List<FeedSource> sources) {
    public record FeedSource(String url, String name) {}
}
