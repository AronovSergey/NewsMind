package com.newsmind.gateway.model;

import java.util.List;

public record FetchRunPageDto(
        List<FetchRunDto> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
