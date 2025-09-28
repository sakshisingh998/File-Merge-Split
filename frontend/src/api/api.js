import axios from "axios";
// src/api/api.js

const BACKEND_URL = "http://localhost:8080/pdf";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const downloadPdf = async (text, fileName) => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("fileName", fileName);

  const res = await api.post("/download-pdf", formData, {
    responseType: "blob",
  });
  return res.data;
};




// Merge PDFs
export const mergeFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const res = await api.post("/merge", formData);
  return res.data;
};

// Split PDF
export const splitFile = async (file, ranges) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ranges", ranges); // send ranges as form field
  const res = await api.post("/split", formData);
  return res.data;
};

// Extract text
export const extractText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/extract-text", formData);
  return res.data;
};

// Summarize text
export const summarizeText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/extract-and-summarize", formData);
  return res.data;
};
