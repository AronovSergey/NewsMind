package com.newsmind.fetcher.feed;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FeedParserTest {

    private final FeedParser parser = new FeedParser();

    @Test
    void parseBbcFeed_returnsAtLeastOneArticle() {
        List<RawArticle> articles = parser.parse("https://feeds.bbci.co.uk/news/rss.xml", "BBC News");

        assertThat(articles).isNotEmpty();
        assertThat(articles.getFirst().title()).isNotBlank();
        assertThat(articles.getFirst().url()).startsWith("http");
        assertThat(articles.getFirst().source()).isEqualTo("BBC News");
    }
}
