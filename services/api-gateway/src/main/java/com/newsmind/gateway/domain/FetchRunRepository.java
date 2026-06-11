package com.newsmind.gateway.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface FetchRunRepository extends JpaRepository<FetchRun, UUID>, JpaSpecificationExecutor<FetchRun> {

    @Query("SELECT DISTINCT s.sourceName FROM FetchRunSource s ORDER BY s.sourceName ASC")
    List<String> findDistinctSourceNames();
}
