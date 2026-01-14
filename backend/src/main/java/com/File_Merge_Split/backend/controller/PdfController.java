package com.File_Merge_Split.backend.controller;

import com.File_Merge_Split.backend.service.SplitService;
import com.File_Merge_Split.backend.service.MergeService;
import com.File_Merge_Split.backend.service.ExtractService;
import com.File_Merge_Split.backend.service.SummarizeService;
import com.File_Merge_Split.backend.service.ImageConversionService;
import com.File_Merge_Split.backend.service.PasswordProtectionService;
import com.File_Merge_Split.backend.service.DigitalSigningService;
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
    private final ImageConversionService imageConversionService;
    private final PasswordProtectionService passwordProtectionService;
    private final DigitalSigningService digitalSigningService;

    public PdfController(SplitService splitService,
                         MergeService mergeService,
                         ExtractService extractService,
                         SummarizeService summarizeService,
                         ImageConversionService imageConversionService,
                         PasswordProtectionService passwordProtectionService,
                         DigitalSigningService digitalSigningService) {
        this.splitService = splitService;
        this.mergeService = mergeService;
        this.extractService = extractService;
        this.summarizeService = summarizeService;
        this.imageConversionService = imageConversionService;
        this.passwordProtectionService = passwordProtectionService;
        this.digitalSigningService = digitalSigningService;
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

    // Image Conversion endpoints
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

    // Password Protection endpoints
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

    // Digital Signing endpoint
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
