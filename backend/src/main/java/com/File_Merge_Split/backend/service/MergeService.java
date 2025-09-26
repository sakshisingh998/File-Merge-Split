package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MergeService {

    public ResponseEntity<Map<String, String>> mergePDFs(List<MultipartFile> files) {
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
}
