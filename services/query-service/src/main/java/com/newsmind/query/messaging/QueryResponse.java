package com.newsmind.query.messaging;

import java.util.List;

public record QueryResponse(
        String answer,
        List<SourceDto> sources
) {}
