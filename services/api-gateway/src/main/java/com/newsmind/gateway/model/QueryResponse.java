package com.newsmind.gateway.model;

import java.util.List;

public record QueryResponse(
        String answer,
        List<SourceDto> sources
) {}
