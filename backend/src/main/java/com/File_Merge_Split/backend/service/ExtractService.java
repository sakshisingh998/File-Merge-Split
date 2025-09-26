package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
public class ExtractService {

    public ResponseEntity<Map<String, String>> extractText(MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile)) {
                PDFTextStripper textStripper = new PDFTextStripper();
                String text = textStripper.getText(document);

                response.put("status", "success");
                response.put("extractedText", text);
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to extract text: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
