package com.File_Merge_Split.backend.service;

import com.google.genai.Client;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private final Client client;

    public GeminiService(Client client) {
        this.client = client;
    }

    public String askGemini(String prompt) {
        int maxRetries = 3;
        int delay = 2000; // ms

        for (int i = 0; i < maxRetries; i++) {
            try {
                log.info("Sending request to Gemini API, attempt {}", i + 1);

                GenerateContentResponse response =
                        client.models.generateContent("gemini-2.5-flash", prompt, null);

                log.info("Gemini API responded successfully.");
                return response.text();

            } catch (ServerException e) {
                log.error("Gemini API Error: {}", e.getMessage());

                if (e.getMessage().contains("503") && i < maxRetries - 1) {
                    log.warn("Retrying in {} ms...", delay);
                    try {
                        Thread.sleep(delay);
                        delay *= 2;
                    } catch (InterruptedException ignored) {}
                } else {
                    throw new RuntimeException("Gemini API Error: " + e.getMessage(), e);
                }
            }
        }

        throw new RuntimeException("Gemini service unavailable after multiple retries.");
    }
}
