package com.File_Merge_Split.backend.controller;

import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/pdf")
public class FileController {

    // Split PDF into 2 parts
    @PostMapping("/split")
    public String splitPDF(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();

        // save uploaded file temporarily
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + fileName);
        file.transferTo(convFile);

        try (PDDocument document = Loader.loadPDF(convFile)) {
            int totalPages = document.getNumberOfPages();
            int midpoint = totalPages / 2;

            // Part 1
            PDDocument part1 = new PDDocument();
            for (int i = 0; i < midpoint; i++) {
                part1.addPage(document.getPage(i));
            }
            part1.save("part1.pdf");
            part1.close();

            // Part 2
            PDDocument part2 = new PDDocument();
            for (int i = midpoint; i < totalPages; i++) {
                part2.addPage(document.getPage(i));
            }
            part2.save("part2.pdf");
            part2.close();
        }

        return "PDF split successfully (files saved as part1.pdf and part2.pdf)";
    }

    // Merge Multiple PDFs
    @PostMapping("/merge")
    public String mergePDFs(@RequestParam("files") List<MultipartFile> files) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        merger.setDestinationFileName("merged.pdf");

        for (MultipartFile f : files) {
            File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + f.getOriginalFilename());
            f.transferTo(convFile);
            merger.addSource(convFile);
        }

        merger.mergeDocuments(null);
        return "PDFs merged successfully (file saved as merged.pdf)";
    }
}
