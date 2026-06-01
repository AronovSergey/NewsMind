package com.newsmind.query.messaging;

import java.time.Instant;

public record SourceDto(
        String title,
        String url,
        String source,
        Instant publishedAt
) {}
