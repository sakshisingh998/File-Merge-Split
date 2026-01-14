package com.File_Merge_Split.backend.controller;

import com.File_Merge_Split.backend.service.SplitService;
import com.File_Merge_Split.backend.service.MergeService;
import com.File_Merge_Split.backend.service.ExtractService;
import com.File_Merge_Split.backend.service.SummarizeService;
import com.File_Merge_Split.backend.service.PdfGeneratorService;
import com.File_Merge_Split.backend.service.ImageConversionService;
import com.File_Merge_Split.backend.service.PasswordProtectionService;
import com.File_Merge_Split.backend.service.DigitalSigningService;
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
    private final PdfGeneratorService pdfGeneratorService;
    private final ImageConversionService imageConversionService;
    private final PasswordProtectionService passwordProtectionService;
    private final DigitalSigningService digitalSigningService;

    public PdfController(SplitService splitService,
                         MergeService mergeService,
                         ExtractService extractService,
                         SummarizeService summarizeService,
                         PdfGeneratorService pdfGeneratorService,
                         ImageConversionService imageConversionService,
                         PasswordProtectionService passwordProtectionService,
                         DigitalSigningService digitalSigningService) {
        this.splitService = splitService;
        this.mergeService = mergeService;
        this.extractService = extractService;
        this.summarizeService = summarizeService;
        this.pdfGeneratorService = pdfGeneratorService;
        this.imageConversionService = imageConversionService;
        this.passwordProtectionService = passwordProtectionService;
        this.digitalSigningService = digitalSigningService;
    }

    // --- SPLIT (unchanged) ---
    @PostMapping("/split")
    public ResponseEntity<byte[]> splitPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ranges") String ranges) {
        return splitService.splitPDF(file, ranges);
    }

    // --- MERGE ---
    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePDFs(
            @RequestParam("files") List<MultipartFile> files) {
        return mergeService.mergePDFs(files);
    }

    // --- EXTRACT TEXT ---
    @PostMapping("/extract-text")
    public ResponseEntity<Map<String, String>> extractText(
            @RequestParam("file") MultipartFile file) {
        ResponseEntity<Map<String, String>> extractResponse = extractService.extractText(file);
        System.out.println("DEBUG: Extracted text -> " + extractResponse.getBody().get("extractedText"));
        return extractResponse;
    }

    // --- EXTRACT AND SUMMARIZE ---
    @PostMapping("/extract-and-summarize")
    public ResponseEntity<Map<String, String>> extractAndSummarize(
            @RequestParam("file") MultipartFile file) {

        ResponseEntity<Map<String, String>> extractResponse = extractService.extractText(file);
        String extractedText = extractResponse.getBody().get("extractedText");

        System.out.println("DEBUG: Extracted Text for summarization -> " + extractedText);

        ResponseEntity<Map<String, String>> summaryResponse = summarizeService.summarize(extractedText);
        System.out.println("DEBUG: Summary returned -> " + summaryResponse.getBody().get("summary"));

        return summaryResponse;
    }

    // --- DOWNLOAD PDF ---
    @PostMapping("/download-pdf")
    public ResponseEntity<byte[]> downloadPdf(@RequestBody Map<String, String> request) {
        String title = request.getOrDefault("title", "Document");
        String bodyText = request.getOrDefault("text", request.getOrDefault("bodyText", ""));
        String fileName = request.getOrDefault("fileName", "document");

        if (fileName == null || fileName.isEmpty()) {
            fileName = "document";
        }
        
        return pdfGeneratorService.generatePdf(title, bodyText, fileName);
    }

    // --- IMAGE CONVERSION ---
    @PostMapping("/pdf-to-image")
    public ResponseEntity<byte[]> pdfToImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "format", defaultValue = "PNG") String format) {
        return imageConversionService.pdfToImage(file, format);
    }

    @PostMapping("/image-to-pdf")
    public ResponseEntity<byte[]> imageToPdf(
            @RequestParam("files") List<MultipartFile> files) {
        return imageConversionService.imageToPdf(files);
    }

    // --- PASSWORD PROTECTION ---
    @PostMapping("/protect")
    public ResponseEntity<byte[]> protectPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("password") String password) {
        return passwordProtectionService.protectPdf(file, password);
    }

    @PostMapping("/unlock")
    public ResponseEntity<byte[]> unlockPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("password") String password) {
        return passwordProtectionService.unlockPdf(file, password);
    }

    // --- DIGITAL SIGNING ---
    @PostMapping("/sign")
    public ResponseEntity<byte[]> signPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("signature") String signatureImageBase64,
            @RequestParam(value = "x", defaultValue = "0") float x,
            @RequestParam(value = "y", defaultValue = "0") float y,
            @RequestParam(value = "width", defaultValue = "200") float width,
            @RequestParam(value = "height", defaultValue = "100") float height) {
        return digitalSigningService.signPdf(file, signatureImageBase64, x, y, width, height);
    }

}
