package com.File_Merge_Split.backend.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    @Value("${google.api.key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("Google API Key is missing! Please set google.api.key in application.properties or as an environment variable.");
        }

        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}
