package com.File_Merge_Split.backend.config;

import com.google.genai.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    private static final Logger log = LoggerFactory.getLogger(GeminiConfig.class);

    @Value("${google.api.key:}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${GOOGLE_API_KEY}")) {
            log.warn("Google API Key is not set. Gemini features will not work. Set GOOGLE_API_KEY environment variable or google.api.key in application.properties.");
            // Create a client with a placeholder - it will fail when used but allows app to start
            return Client.builder()
                    .apiKey("placeholder-key-for-startup")
                    .build();
        }

        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}
