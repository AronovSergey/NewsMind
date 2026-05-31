package com.newsmind.fetcher.feed;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.HttpURLConnection;
import java.net.URI;
import java.time.Instant;
import java.util.List;

@Slf4j
@Component
public class FeedParser {

    public List<RawArticle> parse(String feedUrl, String sourceName) {
        try {
            HttpURLConnection connection = (HttpURLConnection) URI.create(feedUrl).toURL().openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; NewsMind/1.0)");
            connection.setConnectTimeout(10_000);
            connection.setReadTimeout(10_000);
            SyndFeed feed = new SyndFeedInput().build(new XmlReader(connection.getInputStream()));
            return feed.getEntries().stream()
                    .filter(e -> e.getLink() != null && !e.getLink().isBlank())
                    .map(e -> toArticle(e, sourceName))
                    .toList();
        } catch (Exception e) {
            log.error("Failed to parse feed {}: {}", feedUrl, e.getMessage());
            return List.of();
        }
    }

    private RawArticle toArticle(SyndEntry entry, String sourceName) {
        String content = entry.getContents().isEmpty()
                ? (entry.getDescription() != null ? entry.getDescription().getValue() : "")
                : entry.getContents().getFirst().getValue();

        Instant publishedAt = entry.getPublishedDate() != null
                ? entry.getPublishedDate().toInstant()
                : Instant.now();

        return new RawArticle(
                entry.getTitle(),
                content != null ? content : "",
                entry.getLink(),
                sourceName,
                publishedAt
        );
    }
}
