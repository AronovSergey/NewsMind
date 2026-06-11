package com.newsmind.fetcher.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "fetch_run_sources")
@Getter
@Setter
@NoArgsConstructor
public class FetchRunSource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID fetchRunId;

    @Column(nullable = false)
    private String sourceName;

    @Column(nullable = false)
    private int fetched;

    @Column(nullable = false)
    private int newArticles;

    public FetchRunSource(UUID fetchRunId, String sourceName, int fetched, int newArticles) {
        this.fetchRunId = fetchRunId;
        this.sourceName = sourceName;
        this.fetched = fetched;
        this.newArticles = newArticles;
    }
}
