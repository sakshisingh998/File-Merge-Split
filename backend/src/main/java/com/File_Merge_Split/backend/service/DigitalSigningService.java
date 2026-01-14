package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Base64;

@Service
public class DigitalSigningService {

    // Add signature to PDF (using image signature)
    public ResponseEntity<byte[]> signPdf(MultipartFile pdfFile, String signatureImageBase64, 
                                         float x, float y, float width, float height) {
        File convFile = null;

        try {
            String fileName = pdfFile.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            pdfFile.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile);
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

                // Decode base64 signature image
                byte[] signatureBytes = Base64.getDecoder().decode(signatureImageBase64);
                BufferedImage signatureImage = ImageIO.read(new ByteArrayInputStream(signatureBytes));

                if (signatureImage == null) {
                    return ResponseEntity.badRequest()
                            .body("Invalid signature image format".getBytes());
                }

                // Get the last page for signing
                PDPage page = document.getPage(document.getNumberOfPages() - 1);
                PDRectangle pageSize = page.getMediaBox();

                // Default position if not specified
                if (x == 0 && y == 0) {
                    x = pageSize.getWidth() - width - 50;
                    y = 50;
                }

                try (PDPageContentStream contentStream = new PDPageContentStream(
                        document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                    
                    PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                            document, 
                            signatureBytes, 
                            "signature"
                    );
                    contentStream.drawImage(pdImage, x, pageSize.getHeight() - y - height, width, height);
                }

                document.save(baos);
                byte[] pdfBytes = baos.toByteArray();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "signed_" + fileName);

                return ResponseEntity.ok().headers(headers).body(pdfBytes);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to sign PDF: " + e.getMessage()).getBytes());
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }
}
