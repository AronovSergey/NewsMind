package com.newsmind.gateway.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name = "fetch_run_sources")
@Getter
public class FetchRunSource {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fetch_run_id")
    private FetchRun fetchRun;

    private String sourceName;
    private int fetched;
    private int newArticles;
}
