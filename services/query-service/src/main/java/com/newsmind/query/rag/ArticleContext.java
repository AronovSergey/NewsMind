package com.newsmind.query.rag;

import java.time.Instant;

public record ArticleContext(
        String title,
        String content,
        String url,
        String source,
        Instant publishedAt
) {}
