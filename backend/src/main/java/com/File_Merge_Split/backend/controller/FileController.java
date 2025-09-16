package com.File_Merge_Split.backend.controller;

import com.File_Merge_Split.backend.service.GeminiService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pdf")
public class FileController {

    private final GeminiService geminiService;

    public FileController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // Split PDF into 2 parts
    // Custom Split PDF based on page ranges
    @PostMapping("/split")
    public ResponseEntity<Map<String, String>> splitPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ranges") String ranges) {
        Map<String, String> response = new HashMap<>();
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile)) {
                int totalPages = document.getNumberOfPages();

                // Example input: "1-3,4-5,6-10"
                String[] parts = ranges.split(",");
                int partCounter = 1;

                for (String part : parts) {
                    String[] range = part.split("-");
                    int start = Integer.parseInt(range[0]) - 1; // zero-based index
                    int end = Integer.parseInt(range[1]) - 1;

                    if (start < 0 || end >= totalPages || start > end) {
                        response.put("status", "error");
                        response.put("message", "Invalid range: " + part);
                        return ResponseEntity.badRequest().body(response);
                    }

                    PDDocument newDoc = new PDDocument();
                    for (int i = start; i <= end; i++) {
                        newDoc.addPage(document.getPage(i));
                    }

                    String outputFileName = "part" + partCounter + ".pdf";
                    newDoc.save(outputFileName);
                    newDoc.close();
                    partCounter++;
                }
            }

            response.put("status", "success");
            response.put("message", "PDF split successfully into custom parts.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to split PDF: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }

    // Merge Multiple PDFs
    @PostMapping("/merge")
    public ResponseEntity<Map<String, String>> mergePDFs(@RequestParam("files") List<MultipartFile> files) {
        Map<String, String> response = new HashMap<>();

        try {
            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationFileName("merged.pdf");

            for (MultipartFile f : files) {
                File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + f.getOriginalFilename());
                f.transferTo(convFile);
                merger.addSource(convFile);
            }

            merger.mergeDocuments(null);
            response.put("status", "success");
            response.put("message", "PDFs merged successfully (saved as merged.pdf)");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to merge PDFs: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Extract Text and Summarize using Gemini
    @PostMapping("/extract-text")
    public ResponseEntity<Map<String, String>> extractText(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile)) {
                PDFTextStripper textStripper = new PDFTextStripper();
                String text = textStripper.getText(document);

                // Call Gemini for summarization
                String summary = geminiService.askGemini("Summarize the following text:\n\n" + text);

                response.put("status", "success");
                response.put("extractedText", text);
                response.put("summary", summary);
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to extract and summarize text: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
