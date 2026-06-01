package com.newsmind.fetcher.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(nullable = false, unique = true)
    private String url;

    @Column(nullable = false)
    private String source;

    private Instant publishedAt;

    private Instant fetchedAt = Instant.now();

    public Article(String title, String content, String url, String source, Instant publishedAt) {
        this.title = title;
        this.content = content;
        this.url = url;
        this.source = source;
        this.publishedAt = publishedAt;
    }
}
