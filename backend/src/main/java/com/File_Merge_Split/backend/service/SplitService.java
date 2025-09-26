package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
public class SplitService {

    public ResponseEntity<Map<String, String>> splitPDF(MultipartFile file, String ranges) {
        Map<String, String> response = new HashMap<>();
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile)) {
                int totalPages = document.getNumberOfPages();
                String[] parts = ranges.split(",");
                int partCounter = 1;

                for (String part : parts) {
                    String[] range = part.split("-");
                    int start = Integer.parseInt(range[0]) - 1;
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
                    newDoc.save("part" + partCounter + ".pdf");
                    newDoc.close();
                    partCounter++;
                }
            }

            response.put("status", "success");
            response.put("message", "PDF split successfully into parts.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to split PDF: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
