package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.util.List;

@Service
public class MergeService {

    public ResponseEntity<Resource> mergePDFs(List<MultipartFile> files) {
        try {
            PDFMergerUtility merger = new PDFMergerUtility();
            File tempOutputFile = File.createTempFile("merged_", ".pdf");
            merger.setDestinationFileName(tempOutputFile.getAbsolutePath());

            for (MultipartFile f : files) {
                File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + f.getOriginalFilename());
                f.transferTo(convFile);
                merger.addSource(convFile);
            }

            merger.mergeDocuments(null);

            // Read the merged file into a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            try (FileInputStream inputStream = new FileInputStream(tempOutputFile)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }

            byte[] pdfBytes = outputStream.toByteArray();
            ByteArrayResource resource = new ByteArrayResource(pdfBytes);

            // Clean up temp files
            tempOutputFile.delete();
            for (MultipartFile f : files) {
                File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + f.getOriginalFilename());
                if (convFile.exists()) convFile.delete();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=merged.pdf");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
