package com.newsmind.embedding.messaging;

import java.time.Instant;

public record EmbeddedMessage(
        String url,
        String source,
        Instant embeddedAt
) {}
