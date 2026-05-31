package com.newsmind.fetcher.feed;

import java.time.Instant;

public record RawArticle(
        String title,
        String content,
        String url,
        String source,
        Instant publishedAt
) {}
