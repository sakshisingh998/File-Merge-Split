package com.File_Merge_Split.backend;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) throws IOException {
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("Hello World");

		//Created a pdf with a blank page


//		PDDocument document=new PDDocument();
//		PDPage firstpage=new PDPage();
//		document.addPage(firstpage);633333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333

//		document.save("C:\\Users\\hp\\Desktop\\mypdf.pdf");
//		System.out.println("PDF Created");
//		document.close();


	}

}
