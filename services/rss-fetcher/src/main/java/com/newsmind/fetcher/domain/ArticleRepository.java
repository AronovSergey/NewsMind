package com.newsmind.fetcher.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {

    boolean existsByUrl(String url);
}
