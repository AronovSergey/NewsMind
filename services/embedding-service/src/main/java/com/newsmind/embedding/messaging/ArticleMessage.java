package com.newsmind.embedding.messaging;

import java.time.Instant;

public record ArticleMessage(
        String title,
        String content,
        String url,
        String source,
        Instant publishedAt
) {}
