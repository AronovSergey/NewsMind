package com.newsmind.gateway.controller;

import com.newsmind.gateway.domain.FetchRun;
import com.newsmind.gateway.domain.FetchRunRepository;
import com.newsmind.gateway.domain.FetchRunSource;
import com.newsmind.gateway.model.FetchRunDto;
import com.newsmind.gateway.model.FetchRunPageDto;
import com.newsmind.gateway.model.FetchRunSourceDto;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FetchController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("startedAt", "completedAt", "totalFetched", "totalNew");

    private final FetchRunRepository fetchRunRepository;

    @GetMapping("/fetches")
    public ResponseEntity<FetchRunPageDto> getFetches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "startedAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        if (page < 0) page = 0;
        if (size < 1 || size > 100) size = 20;

        String sortField = ALLOWED_SORT_FIELDS.contains(sort) ? sort : "startedAt";
        Sort.Direction sortDir = "ASC".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(sortDir, sortField));

        Specification<FetchRun> spec = Specification.where(null);

        if (source != null && !source.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                Join<FetchRun, FetchRunSource> sources = root.join("sources");
                return cb.equal(sources.get("sourceName"), source);
            });
        }
        if (from != null && !from.isBlank()) {
            Instant fromInstant = Instant.parse(from);
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("startedAt"), fromInstant));
        }
        if (to != null && !to.isBlank()) {
            Instant toInstant = Instant.parse(to);
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("startedAt"), toInstant));
        }

        Page<FetchRun> result = fetchRunRepository.findAll(spec, pageable);

        List<FetchRunDto> content = result.getContent().stream()
                .map(run -> new FetchRunDto(
                        run.getId(),
                        run.getStartedAt(),
                        run.getCompletedAt(),
                        run.getTotalFetched(),
                        run.getTotalNew(),
                        run.getSources().stream()
                                .map(s -> new FetchRunSourceDto(s.getSourceName(), s.getFetched(), s.getNewArticles()))
                                .toList()
                ))
                .toList();

        return ResponseEntity.ok(new FetchRunPageDto(
                content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()
        ));
    }

    @GetMapping("/fetches/sources")
    public ResponseEntity<List<String>> getSources() {
        return ResponseEntity.ok(fetchRunRepository.findDistinctSourceNames());
    }
}
