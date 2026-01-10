package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class SplitService {

    public ResponseEntity<Resource> splitPDF(MultipartFile file, String ranges) {
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            String baseFileName = fileName != null && fileName.contains(".") 
                ? fileName.substring(0, fileName.lastIndexOf(".")) 
                : "split";
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
            ZipOutputStream zip = new ZipOutputStream(zipOutputStream);

            try (PDDocument document = Loader.loadPDF(convFile)) {
                int totalPages = document.getNumberOfPages();
                String[] parts = ranges.split(",");
                int partCounter = 1;

                for (String part : parts) {
                    String[] range = part.trim().split("-");
                    int start = Integer.parseInt(range[0]) - 1;
                    int end = Integer.parseInt(range[1]) - 1;

                    if (start < 0 || end >= totalPages || start > end) {
                        zip.close();
                        return ResponseEntity.badRequest().build();
                    }

                    PDDocument newDoc = new PDDocument();
                    for (int i = start; i <= end; i++) {
                        newDoc.addPage(document.getPage(i));
                    }

                    // Save to byte array instead of file
                    ByteArrayOutputStream partOutputStream = new ByteArrayOutputStream();
                    newDoc.save(partOutputStream);
                    byte[] partBytes = partOutputStream.toByteArray();

                    // Add to zip
                    ZipEntry entry = new ZipEntry(baseFileName + "_part" + partCounter + ".pdf");
                    zip.putNextEntry(entry);
                    zip.write(partBytes);
                    zip.closeEntry();

                    newDoc.close();
                    partCounter++;
                }
            }

            zip.close();
            byte[] zipBytes = zipOutputStream.toByteArray();
            ByteArrayResource resource = new ByteArrayResource(zipBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + baseFileName + "_split.zip");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(zipBytes.length)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
