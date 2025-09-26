package com.File_Merge_Split.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.File_Merge_Split.backend.service.GeminiService;

import java.util.HashMap;
import java.util.Map;

@Service
public class SummarizeService {

    private final GeminiService geminiService;

    public SummarizeService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public ResponseEntity<Map<String, String>> summarize(String text) {
        Map<String, String> response = new HashMap<>();

        System.out.println("DEBUG: Text received by SummarizeService -> " + text);

        try {
            String summary = geminiService.askGemini("Summarize the following text:\n\n" + text);

            System.out.println("DEBUG: Summary from GeminiService -> " + summary);

            response.put("status", "success");
            response.put("summary", summary); // Only return summary
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "Failed to summarize text: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
