package com.newsmind.gateway.model;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record FetchRunDto(
        UUID id,
        Instant startedAt,
        Instant completedAt,
        int totalFetched,
        int totalNew,
        List<FetchRunSourceDto> sources
) {
}
