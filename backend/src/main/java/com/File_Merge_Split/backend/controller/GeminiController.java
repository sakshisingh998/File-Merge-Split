package com.File_Merge_Split.backend.controller;


import com.File_Merge_Split.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gemini")

public class GeminiController {
    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/summarize")
    public String askGeminiAPI(@RequestBody String prompt){

        return geminiService.askGemini(prompt);
    }
}
