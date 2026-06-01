package com.newsmind.fetcher.scheduler;

import com.newsmind.fetcher.feed.ArticleDeduplicator;
import com.newsmind.fetcher.feed.FeedParser;
import com.newsmind.fetcher.feed.RawArticle;
import com.newsmind.fetcher.messaging.ArticlePublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class FetchScheduler {

    private static final Map<String, String> FEEDS = Map.of(
            "https://feeds.bbci.co.uk/news/rss.xml",              "BBC News",
            "https://techcrunch.com/feed/",                        "TechCrunch",
            "https://feeds.npr.org/1001/rss.xml",                  "NPR News",
            "https://www.theverge.com/rss/index.xml",              "The Verge",
            "https://hnrss.org/frontpage",                         "Hacker News",
            "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", "NY Times"
    );

    private final FeedParser feedParser;
    private final ArticleDeduplicator deduplicator;
    private final ArticlePublisher publisher;

    @Scheduled(fixedDelay = 3_600_000) // every 60 minutes
    public void fetchAll() {
        log.info("Starting RSS fetch cycle");
        int totalPublished = 0;

        for (Map.Entry<String, String> feed : FEEDS.entrySet()) {
            List<RawArticle> fetched = feedParser.parse(feed.getKey(), feed.getValue());
            List<RawArticle> newArticles = deduplicator.insertNew(fetched);
            newArticles.forEach(publisher::publish);
            totalPublished += newArticles.size();
            log.info("Feed [{}]: {} fetched, {} new", feed.getValue(), fetched.size(), newArticles.size());
        }

        log.info("Fetch cycle complete — {} new articles published", totalPublished);
    }
}
