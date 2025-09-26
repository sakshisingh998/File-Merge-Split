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
        // Start delay at a short interval (e.g., 500ms) for rate-limiting,
        // increasing exponentially for better backoff.
        long delay = 500;

        for (int i = 0; i < maxRetries; i++) {
            try {
                log.info("Sending request to Gemini API, attempt {}", i + 1);

                GenerateContentResponse response =
                        client.models.generateContent("gemini-2.5-flash", prompt, null);

                log.info("Gemini API responded successfully.");
                return response.text();

            } catch (ServerException e) {
                String errorMessage = e.getMessage();
                log.error("Gemini API Error (Attempt {}): {}", i + 1, errorMessage);

                // --- MODIFIED RETRY LOGIC ---
                // If it's not the last attempt, sleep and retry.
                // This will handle 429 (Rate Limit) errors, 503 (Service Unavailable) errors,
                // and other transient ServerExceptions gracefully.
                if (i < maxRetries - 1) {
                    // Log the type of failure for clarity
                    if (errorMessage.contains("429")) {
                        log.warn("Rate limit hit. Retrying in {} ms with exponential backoff...", delay);
                    } else {
                        log.warn("Transient server error. Retrying in {} ms with exponential backoff...", delay);
                    }

                    try {
                        Thread.sleep(delay);
                        // Exponential backoff: double the delay for the next retry
                        delay *= 2;
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Retry thread interrupted.", e);
                    }
                } else {
                    // Throw the exception if all retries are exhausted
                    throw new RuntimeException("Gemini API failed after all retries. Last Error: " + errorMessage, e);
                }
            }
        }

        // Should theoretically be unreachable due to the throw in the loop, but kept for safety
        throw new RuntimeException("Gemini service unavailable after multiple retries.");
    }
}