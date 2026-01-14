package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;

@Service
public class PasswordProtectionService {

    // Add password protection to PDF
    public ResponseEntity<byte[]> protectPdf(MultipartFile file, String password) {
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile);
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

                AccessPermission ap = new AccessPermission();
                ap.setCanPrint(false);
                ap.setCanModify(false);
                ap.setCanExtractContent(false);
                ap.setCanExtractForAccessibility(false);

                StandardProtectionPolicy spp = new StandardProtectionPolicy(password, password, ap);
                spp.setEncryptionKeyLength(256);
                spp.setPermissions(ap);
                document.protect(spp);

                document.save(baos);
                byte[] pdfBytes = baos.toByteArray();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "protected_" + fileName);

                return ResponseEntity.ok().headers(headers).body(pdfBytes);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to protect PDF: " + e.getMessage()).getBytes());
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }

    // Remove password protection from PDF
    public ResponseEntity<byte[]> unlockPdf(MultipartFile file, String password) {
        File convFile = null;

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile, password);
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

                // Create a new document without protection
                PDDocument newDocument = new PDDocument();
                
                // Copy all pages
                for (int i = 0; i < document.getNumberOfPages(); i++) {
                    newDocument.addPage(document.getPage(i));
                }

                newDocument.save(baos);
                newDocument.close();

                byte[] pdfBytes = baos.toByteArray();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "unlocked_" + fileName);

                return ResponseEntity.ok().headers(headers).body(pdfBytes);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to unlock PDF: " + e.getMessage()).getBytes());
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}

