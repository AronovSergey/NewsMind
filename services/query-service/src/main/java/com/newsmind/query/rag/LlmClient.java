package com.newsmind.query.rag;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatCompletion;
import com.openai.models.ChatCompletionCreateParams;
import com.openai.models.ChatCompletionMessageParam;
import com.openai.models.ChatCompletionSystemMessageParam;
import com.openai.models.ChatCompletionUserMessageParam;
import com.openai.models.ChatModel;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class LlmClient {

    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_DELAY_MS = 1000L;

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.chat-model}")
    private String chatModel;

    private OpenAIClient client;

    @PostConstruct
    void init() {
        client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();
    }

    public String complete(String systemPrompt, String userPrompt) {
        Exception lastException = null;
        long delay = INITIAL_DELAY_MS;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                var params = ChatCompletionCreateParams.builder()
                        .model(ChatModel.of(chatModel))
                        .messages(List.of(
                                ChatCompletionMessageParam.ofChatCompletionSystemMessageParam(
                                        ChatCompletionSystemMessageParam.builder()
                                                .content(ChatCompletionSystemMessageParam.Content.ofTextContent(systemPrompt))
                                                .build()
                                ),
                                ChatCompletionMessageParam.ofChatCompletionUserMessageParam(
                                        ChatCompletionUserMessageParam.builder()
                                                .content(ChatCompletionUserMessageParam.Content.ofTextContent(userPrompt))
                                                .build()
                                )
                        ))
                        .build();

                ChatCompletion completion = client.chat().completions().create(params);
                return completion.choices().get(0).message().content().orElse("");

            } catch (Exception e) {
                lastException = e;
                log.warn("OpenAI chat attempt {}/{} failed: {}", attempt, MAX_RETRIES, e.getMessage());
                if (attempt < MAX_RETRIES) {
                    try {
                        Thread.sleep(delay);
                        delay *= 2;
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Interrupted during retry", ie);
                    }
                }
            }
        }
        throw new RuntimeException("OpenAI chat API failed after " + MAX_RETRIES + " attempts", lastException);
    }
}
