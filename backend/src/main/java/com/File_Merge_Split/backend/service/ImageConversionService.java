package com.File_Merge_Split.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
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
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ImageConversionService {

    // PDF to Image conversion
    public ResponseEntity<byte[]> pdfToImage(MultipartFile file, String format) {
        File convFile = null;
        ByteArrayOutputStream zipOut = new ByteArrayOutputStream();

        try {
            String fileName = file.getOriginalFilename();
            convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
            file.transferTo(convFile);

            try (PDDocument document = Loader.loadPDF(convFile);
                 ZipOutputStream zos = new ZipOutputStream(zipOut)) {

                PDFRenderer pdfRenderer = new PDFRenderer(document);
                int totalPages = document.getNumberOfPages();

                for (int page = 0; page < totalPages; page++) {
                    BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300);
                    ByteArrayOutputStream imageOut = new ByteArrayOutputStream();
                    ImageIO.write(image, format.toLowerCase(), imageOut);

                    ZipEntry entry = new ZipEntry("page_" + (page + 1) + "." + format.toLowerCase());
                    zos.putNextEntry(entry);
                    zos.write(imageOut.toByteArray());
                    zos.closeEntry();
                }
            }

            String contentType = format.equalsIgnoreCase("PNG") 
                ? MediaType.IMAGE_PNG_VALUE 
                : MediaType.IMAGE_JPEG_VALUE;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"pdf_to_" + format.toLowerCase() + ".zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipOut.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to convert PDF to images: " + e.getMessage()).getBytes());
        } finally {
            if (convFile != null && convFile.exists()) convFile.delete();
        }
    }

    // Image to PDF conversion
    public ResponseEntity<byte[]> imageToPdf(List<MultipartFile> files) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            for (MultipartFile file : files) {
                BufferedImage image = ImageIO.read(file.getInputStream());
                if (image == null) {
                    continue;
                }

                float width = image.getWidth();
                float height = image.getHeight();
                PDPage page = new PDPage(new PDRectangle(width, height));
                document.addPage(page);

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    PDImageXObject pdImage = PDImageXObject.createFromByteArray(
                            document, 
                            file.getBytes(), 
                            file.getOriginalFilename()
                    );
                    contentStream.drawImage(pdImage, 0, 0, width, height);
                }
            }

            document.save(baos);
            byte[] pdfBytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "images_to_pdf.pdf");

            return ResponseEntity.ok().headers(headers).body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(("Failed to convert images to PDF: " + e.getMessage()).getBytes());
        }
    }
}

