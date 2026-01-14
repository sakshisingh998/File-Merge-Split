package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    public ResponseEntity<byte[]> generatePdf(String title, String bodyText, String fileName) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();

                float yPosition = 750;
                
                // --- Title (if provided) ---
                if (title != null && !title.isEmpty() && !title.equals("Document")) {
                    // Use Times-Bold font - compatible with PDFBox 3.x
                    PDType1Font fontBold = new PDType1Font(org.apache.pdfbox.pdmodel.font.Standard14Fonts.FontName.TIMES_BOLD);
                    contentStream.setFont(fontBold, 16);
                    contentStream.newLineAtOffset(50, yPosition);
                    contentStream.showText(title);
                    yPosition -= 30; // Move down for body text
                }

                // --- Body ---
                if (bodyText != null && !bodyText.isEmpty()) {
                    // Use Times-Roman font - compatible with PDFBox 3.x
                    PDType1Font fontRoman = new PDType1Font(org.apache.pdfbox.pdmodel.font.Standard14Fonts.FontName.TIMES_ROMAN);
                    contentStream.setFont(fontRoman, 12);
                    contentStream.setLeading(14.5f);
                    contentStream.newLineAtOffset(50, yPosition);
                    
                    // Split by newlines and write each line
                    String[] lines = bodyText.split("\n");
                    for (String line : lines) {
                        if (line != null && !line.trim().isEmpty()) {
                            contentStream.showText(line);
                            contentStream.newLine();
                        }
                    }
                }

                contentStream.endText();
            }

            document.save(baos);
            byte[] pdfBytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", fileName + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
}
