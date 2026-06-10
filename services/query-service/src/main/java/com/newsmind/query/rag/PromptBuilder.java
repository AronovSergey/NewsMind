package com.newsmind.query.rag;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    public static final String SYSTEM_PROMPT = """
            You are NewsMind, a helpful news assistant.
            You answer questions about current events based only on the provided news articles.
            Always be factual, concise, and neutral in tone.
            If the provided articles don't contain enough information to answer the question,
            say so honestly rather than speculating.
            Your audience includes non-technical professionals — avoid jargon.
            """;

    public String buildUserPrompt(String question, List<ArticleContext> articles) {
        var sb = new StringBuilder();
        sb.append("Answer the following question using only the news articles below.\n");
        sb.append("At the end of your answer, list which article numbers you used as sources.\n\n");
        sb.append("Question: <user_question>").append(question).append("</user_question>\n\nArticles:\n");
        for (int i = 0; i < articles.size(); i++) {
            ArticleContext a = articles.get(i);
            sb.append(String.format("[%d] %s (%s)%n%s%n%s%n%n",
                    i + 1,
                    a.source(),
                    a.publishedAt(),
                    a.title(),
                    a.content().substring(0, Math.min(2000, a.content().length()))
            ));
        }
        sb.append("Answer:");
        return sb.toString();
    }
}
