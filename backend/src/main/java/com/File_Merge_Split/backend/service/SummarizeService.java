package com.File_Merge_Split.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SummarizeService {

    private static final Logger log = LoggerFactory.getLogger(SummarizeService.class);
    private final GeminiService geminiService;

    public SummarizeService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public ResponseEntity<Map<String, String>> summarize(String text) {
        Map<String, String> response = new HashMap<>();

        try {
            String summary = geminiService.askGemini("Summarize the following text:\n\n" + text);
            response.put("status", "success");
            response.put("summary", summary);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to summarize text", e);
            response.put("status", "error");
            response.put("message", "Failed to summarize text: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
