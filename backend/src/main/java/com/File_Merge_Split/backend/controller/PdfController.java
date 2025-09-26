package com.File_Merge_Split.backend.controller;

import com.File_Merge_Split.backend.service.SplitService;
import com.File_Merge_Split.backend.service.MergeService;
import com.File_Merge_Split.backend.service.ExtractService;
import com.File_Merge_Split.backend.service.SummarizeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private final SplitService splitService;
    private final MergeService mergeService;
    private final ExtractService extractService;
    private final SummarizeService summarizeService;

    public PdfController(SplitService splitService,
                         MergeService mergeService,
                         ExtractService extractService,
                         SummarizeService summarizeService) {
        this.splitService = splitService;
        this.mergeService = mergeService;
        this.extractService = extractService;
        this.summarizeService = summarizeService;
    }

    @PostMapping("/split")
    public ResponseEntity<Map<String, String>> splitPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ranges") String ranges) {
        return splitService.splitPDF(file, ranges);
    }


    @PostMapping("/merge")
    public ResponseEntity<Map<String, String>> mergePDFs(
            @RequestParam("files") List<MultipartFile> files) {
        return mergeService.mergePDFs(files);
    }

    @PostMapping("/extract-text")
    public ResponseEntity<Map<String, String>> extractText(
            @RequestParam("file") MultipartFile file) {
        return extractService.extractText(file);
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>>
    summarizeText(@RequestBody Map<String, String> request) {
        String extractedText = request.get("extractedText");
        return summarizeService.summarize(extractedText);
    }

}
