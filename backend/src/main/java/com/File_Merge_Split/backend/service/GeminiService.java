package com.File_Merge_Split.backend.service;

import com.google.genai.Client;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(Client client) {
        this.client = client;
    }

    public String askGemini(String prompt) {
        int maxRetries = 3;      // कितनी बार retry करना है
        int delay = 2000;        // initial delay 2 seconds

        for (int i = 0; i < maxRetries; i++) {
            try {
                GenerateContentResponse response =
                        client.models.generateContent(
                                "gemini-2.5-flash",
                                prompt,
                                null);

                return response.text(); // success case → result return करो

            } catch (ServerException e) {
                if (e.getMessage().contains("503") && i < maxRetries - 1) {
                    try {
                        Thread.sleep(delay); // wait before retry
                        delay *= 2; // exponential backoff (2s → 4s → 8s)
                    } catch (InterruptedException ignored) {}
                } else {
                    throw new RuntimeException("Gemini API Error: " + e.getMessage(), e);
                }
            }
        }

        throw new RuntimeException("Gemini service unavailable after multiple retries.");
    }
}
