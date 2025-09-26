package com.File_Merge_Split.backend.service;

import com.File_Merge_Split.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SummarizeService {

    private final GeminiService geminiService;

    public SummarizeService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public ResponseEntity<Map<String, String>> summarize(String extractedText) {
        Map<String, String> response = new HashMap<>();

        try {
            String summary = geminiService.askGemini(
                    "Summarize the following text based on the content relevance:\n\n" + extractedText
            );

            response.put("status", "success");
            response.put("summary", summary);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to summarize text: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
