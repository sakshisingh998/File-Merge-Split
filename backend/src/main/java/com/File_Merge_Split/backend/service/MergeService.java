package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
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

    public ResponseEntity<byte[]> mergePDFs(List<MultipartFile> files) {
        File mergedFile = null;

        try {
            PDFMergerUtility merger = new PDFMergerUtility();
            mergedFile = new File(System.getProperty("java.io.tmpdir") + "/merged_" + System.currentTimeMillis() + ".pdf");
            merger.setDestinationFileName(mergedFile.getAbsolutePath());

            for (MultipartFile f : files) {
                File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + f.getOriginalFilename());
                f.transferTo(convFile);
                merger.addSource(convFile);
            }

            merger.mergeDocuments(null);

            // Read the merged file into byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (FileInputStream fis = new FileInputStream(mergedFile)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    baos.write(buffer, 0, bytesRead);
                }
            }

            byte[] pdfBytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");

            return ResponseEntity.ok().headers(headers).body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to merge PDFs: " + e.getMessage()).getBytes());
        } finally {
            // Clean up temporary files
            if (mergedFile != null && mergedFile.exists()) {
                mergedFile.delete();
            }
        }
    }
}
