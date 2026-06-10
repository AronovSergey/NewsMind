package com.newsmind.fetcher.scheduler;

import com.newsmind.fetcher.config.FeedsConfig;
import com.newsmind.fetcher.feed.ArticleDeduplicator;
import com.newsmind.fetcher.feed.FeedParser;
import com.newsmind.fetcher.feed.RawArticle;
import com.newsmind.fetcher.messaging.ArticlePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FetchScheduler {

    private final FeedParser feedParser;
    private final ArticleDeduplicator deduplicator;
    private final ArticlePublisher publisher;
    private final FeedsConfig feedsConfig;

    @Scheduled(fixedDelay = 3_600_000)
    public void fetchAll() {
        log.info("Starting RSS fetch cycle");
        int totalPublished = 0;

        for (FeedsConfig.FeedSource feed : feedsConfig.sources()) {
            List<RawArticle> fetched = feedParser.parse(feed.url(), feed.name());
            List<RawArticle> newArticles = deduplicator.insertNew(fetched);
            newArticles.forEach(publisher::publish);
            totalPublished += newArticles.size();
            log.info("Feed [{}]: {} fetched, {} new", feed.name(), fetched.size(), newArticles.size());
        }

        log.info("Fetch cycle complete — {} new articles published", totalPublished);
    }
}
