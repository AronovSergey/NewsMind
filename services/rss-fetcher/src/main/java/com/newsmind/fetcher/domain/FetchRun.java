package com.newsmind.fetcher.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "fetch_runs")
@Getter
@Setter
@NoArgsConstructor
public class FetchRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant completedAt;

    @Column(nullable = false)
    private int totalFetched;

    @Column(nullable = false)
    private int totalNew;

    @PrePersist
    void prePersist() {
        if (startedAt == null) startedAt = Instant.now();
    }
}
