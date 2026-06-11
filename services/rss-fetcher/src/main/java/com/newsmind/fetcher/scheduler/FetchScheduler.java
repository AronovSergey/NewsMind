package com.newsmind.fetcher.scheduler;

import com.newsmind.fetcher.config.FeedsConfig;
import com.newsmind.fetcher.domain.FetchRun;
import com.newsmind.fetcher.domain.FetchRunRepository;
import com.newsmind.fetcher.domain.FetchRunSource;
import com.newsmind.fetcher.domain.FetchRunSourceRepository;
import com.newsmind.fetcher.feed.ArticleDeduplicator;
import com.newsmind.fetcher.feed.FeedParser;
import com.newsmind.fetcher.feed.RawArticle;
import com.newsmind.fetcher.messaging.ArticlePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FetchScheduler {

    private final FeedParser feedParser;
    private final ArticleDeduplicator deduplicator;
    private final ArticlePublisher publisher;
    private final FeedsConfig feedsConfig;
    private final FetchRunRepository fetchRunRepository;
    private final FetchRunSourceRepository fetchRunSourceRepository;

    @Scheduled(fixedDelay = 3_600_000)
    public void fetchAll() {
        log.info("Starting RSS fetch cycle");

        FetchRun run = new FetchRun();
        fetchRunRepository.save(run);

        int totalFetched = 0;
        int totalNew = 0;

        for (FeedsConfig.FeedSource feed : feedsConfig.sources()) {
            List<RawArticle> fetched = feedParser.parse(feed.url(), feed.name());
            List<RawArticle> newArticles = deduplicator.insertNew(fetched);
            newArticles.forEach(publisher::publish);

            int sourceFetched = fetched.size();
            int sourceNew = newArticles.size();
            totalFetched += sourceFetched;
            totalNew += sourceNew;

            fetchRunSourceRepository.save(new FetchRunSource(run.getId(), feed.name(), sourceFetched, sourceNew));
            log.info("Feed [{}]: {} fetched, {} new", feed.name(), sourceFetched, sourceNew);
        }

        run.setTotalFetched(totalFetched);
        run.setTotalNew(totalNew);
        run.setCompletedAt(Instant.now());
        fetchRunRepository.save(run);

        log.info("Fetch cycle complete — {} new articles published", totalNew);
    }
}
