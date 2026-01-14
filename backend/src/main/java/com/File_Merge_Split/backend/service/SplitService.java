package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class SplitService {

    public ResponseEntity<byte[]> splitPDF(MultipartFile file, String ranges) {
        File convFile = null;
        ByteArrayOutputStream zipOut = new ByteArrayOutputStream();

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile);
                 ZipOutputStream zos = new ZipOutputStream(zipOut)) {

                int totalPages = document.getNumberOfPages();
                String[] parts = ranges.split(",");
                int partCounter = 1;

                for (String part : parts) {
                    String[] range = part.split("-");
                    int start = Integer.parseInt(range[0]) - 1;
                    int end = Integer.parseInt(range[1]) - 1;

                    if (start < 0 || end >= totalPages || start > end) {
                        return ResponseEntity.badRequest()
                                .body(("Invalid range: " + part).getBytes());
                    }

                    PDDocument newDoc = new PDDocument();
                    for (int i = start; i <= end; i++) {
                        newDoc.addPage(document.getPage(i));
                    }

                    ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();
                    newDoc.save(pdfOut);
                    newDoc.close();

                    // Add each split PDF to ZIP
                    ZipEntry entry = new ZipEntry("part" + partCounter + ".pdf");
                    zos.putNextEntry(entry);
                    zos.write(pdfOut.toByteArray());
                    zos.closeEntry();

                    partCounter++;
                }
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"splitted_pdfs.zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipOut.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to split PDF: " + e.getMessage()).getBytes());
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
