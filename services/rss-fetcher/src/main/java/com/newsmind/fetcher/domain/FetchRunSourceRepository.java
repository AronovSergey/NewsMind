package com.newsmind.fetcher.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FetchRunSourceRepository extends JpaRepository<FetchRunSource, UUID> {
}
