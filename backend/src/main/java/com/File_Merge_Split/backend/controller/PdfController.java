package com.File_Merge_Split.backend.controller;

import com.File_Merge_Split.backend.service.SplitService;
import com.File_Merge_Split.backend.service.MergeService;
import com.File_Merge_Split.backend.service.ExtractService;
import com.File_Merge_Split.backend.service.SummarizeService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pdf")
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
    public ResponseEntity<Resource> splitPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ranges") String ranges) {
        return splitService.splitPDF(file, ranges);
    }

    @PostMapping("/merge")
    public ResponseEntity<Resource> mergePDFs(
            @RequestParam("files") List<MultipartFile> files) {
        return mergeService.mergePDFs(files);
    }

    @PostMapping("/extract-text")
    public ResponseEntity<Map<String, String>> extractText(
            @RequestParam("file") MultipartFile file) {
        return extractService.extractText(file);
    }

    @PostMapping("/extract-and-summarize")
    public ResponseEntity<Map<String, String>> extractAndSummarize(
            @RequestParam("file") MultipartFile file) {
        ResponseEntity<Map<String, String>> extractResponse = extractService.extractText(file);
        String extractedText = extractResponse.getBody().get("extractedText");
        return summarizeService.summarize(extractedText);
    }
}
