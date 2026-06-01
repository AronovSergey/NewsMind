package com.newsmind.fetcher.feed;

import com.newsmind.fetcher.domain.Article;
import com.newsmind.fetcher.domain.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleDeduplicator {

    private final ArticleRepository articleRepository;

    /**
     * Inserts articles that don't exist yet (by URL). Returns the ones actually inserted.
     */
    public List<RawArticle> insertNew(List<RawArticle> articles) {
        return articles.stream()
                .filter(this::tryInsert)
                .toList();
    }

    private boolean tryInsert(RawArticle raw) {
        if (articleRepository.existsByUrl(raw.url())) {
            log.debug("Skipped duplicate: {}", raw.url());
            return false;
        }
        articleRepository.save(new Article(raw.title(), raw.content(), raw.url(), raw.source(), raw.publishedAt()));
        log.debug("Inserted new article: {}", raw.url());
        return true;
    }
}
