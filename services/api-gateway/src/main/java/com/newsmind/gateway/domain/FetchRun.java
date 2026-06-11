package com.newsmind.gateway.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "fetch_runs")
@Getter
public class FetchRun {

    @Id
    private UUID id;

    private Instant startedAt;
    private Instant completedAt;
    private int totalFetched;
    private int totalNew;

    @OneToMany(mappedBy = "fetchRun", fetch = FetchType.LAZY)
    private List<FetchRunSource> sources;
}
