import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "/pdf";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Helper function to download a blob as a file
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadPdf = async (text, fileName) => {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("fileName", fileName);

  const res = await api.post("/download-pdf", formData, {
    responseType: "blob",
  });
  return res.data;
};

// Merge PDFs - returns blob for download
export const mergeFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const res = await api.post("/merge", formData, {
    responseType: "blob",
  });
  return res.data;
};

// Split PDF - returns blob (zip file) for download
export const splitFile = async (file, ranges) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ranges", ranges);
  const res = await api.post("/split", formData, {
    responseType: "blob",
  });
  return res.data;
};

// Extract text - returns JSON with extracted text
export const extractText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/extract-text", formData);
  return res.data;
};

// Summarize text - returns JSON with summary
export const summarizeText = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/extract-and-summarize", formData);
  return res.data;
};
