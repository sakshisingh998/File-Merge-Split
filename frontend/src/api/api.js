// src/api/api.js
import axios from "axios";

const BACKEND_URL = "http://localhost:8080/pdf";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Download a text as PDF
export const downloadPdf = async (text, fileName) => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("fileName", fileName);

  const res = await api.post("/download-pdf", formData, {
    responseType: "blob", // PDF binary
  });
  return res.data; // Blob
};

// Merge PDFs
export const mergeFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await api.post("/merge", formData, {
    responseType: "arraybuffer", // merged PDF as binary
  });

  return res.data; // ArrayBuffer (PDF bytes)
};

// Split PDF
export const splitFile = async (file, ranges) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ranges", ranges); // send ranges as form field

  const res = await api.post("/split", formData, {
    responseType: "arraybuffer", // important for ZIP download
  });

  return res.data; // ArrayBuffer
};

// Extract text from PDF
export const extractText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/extract-text", formData);
  return res.data; // JSON text
};

// Summarize PDF text
export const summarizeText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/extract-and-summarize", formData);
  return res.data; // JSON summary
};

// PDF to Image conversion
export const pdfToImage = async (file, format = "PNG") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  const res = await api.post("/pdf-to-image", formData, {
    responseType: "arraybuffer",
  });
  return res.data; // ZIP file with images
};

// Image to PDF conversion
export const imageToPdf = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await api.post("/image-to-pdf", formData, {
    responseType: "arraybuffer",
  });
  return res.data; // PDF bytes
};

// Protect PDF with password
export const protectPdf = async (file, password) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);

  const res = await api.post("/protect", formData, {
    responseType: "arraybuffer",
  });
  return res.data; // Protected PDF bytes
};

// Unlock PDF
export const unlockPdf = async (file, password) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);

  const res = await api.post("/unlock", formData, {
    responseType: "arraybuffer",
  });
  return res.data; // Unlocked PDF bytes
};

// Sign PDF
export const signPdf = async (file, signatureImageBase64, x, y, width, height) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signatureImageBase64);
  formData.append("x", x);
  formData.append("y", y);
  formData.append("width", width);
  formData.append("height", height);

  const res = await api.post("/sign", formData, {
    responseType: "arraybuffer",
  });
  return res.data; // Signed PDF bytes
};
