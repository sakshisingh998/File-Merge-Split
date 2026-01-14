// src/components/modules/Convert.jsx - Image Conversion Module
import React, { useState } from "react";
import { Image, FileDown, ArrowRightLeft } from "lucide-react";
import DragDropUpload from "../DragDropUpload";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import Toast from "../Toast";
import { pdfToImage, imageToPdf } from "../../api/api";

function Convert({ theme }) {
  const [activeTool, setActiveTool] = useState("pdf-to-image");
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState("PNG");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [result, setResult] = useState(null);

  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        surface: "#2B1D1D",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        border: "#3F2E2E",
        accent: "#E0B089",
      }
    : {
        bg: "#FAF7F5",
        surface: "#FFFFFF",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        border: "#E5DED9",
        accent: "#E0B089",
      };

  const tools = [
    { id: "pdf-to-image", label: "PDF to Image", icon: Image, description: "Convert PDF pages to images" },
    { id: "image-to-pdf", label: "Image to PDF", icon: FileDown, description: "Combine images into PDF" },
  ];

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
  };

  const handlePdfToImage = async () => {
    if (!files[0]) {
      setToast({ message: "Please select a PDF file", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const zipArrayBuffer = await pdfToImage(files[0], format);
      const blob = new Blob([zipArrayBuffer], { type: "application/zip" });
      setResult({ type: "zip", blob, filename: `pdf_to_${format.toLowerCase()}.zip` });
      setProgress(100);
      setToast({ message: "PDF converted to images successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Conversion failed", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleImageToPdf = async () => {
    if (files.length === 0) {
      setToast({ message: "Please select at least one image file", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const pdfArrayBuffer = await imageToPdf(files);
      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      setResult({ type: "pdf", blob, filename: "images_to_pdf.pdf" });
      setProgress(100);
      setToast({ message: "Images converted to PDF successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Conversion failed", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const url = window.URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CurrentTool = tools.find(t => t.id === activeTool);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text }}>
          Convert
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          Convert between PDF and image formats (PNG, JPG, WebP)
        </p>
      </div>

      {/* Tool Selector */}
      <div className="flex gap-2 flex-wrap">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setFiles([]);
                setResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive ? "font-semibold" : ""
              }`}
              style={{
                backgroundColor: isActive ? themeColors.accent : themeColors.surface,
                color: isActive ? "#FFFFFF" : themeColors.text,
                border: `1px solid ${isActive ? themeColors.accent : themeColors.border}`,
              }}
            >
              <Icon size={18} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Card */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        {CurrentTool && (
          <div className="flex items-center gap-3 mb-6">
            <CurrentTool.icon size={24} style={{ color: themeColors.accent }} />
            <div>
              <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
                {CurrentTool.label}
              </h2>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                {CurrentTool.description}
              </p>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-6">
          <DragDropUpload
            onFilesSelected={handleFilesSelected}
            accept={activeTool === "pdf-to-image" ? "application/pdf" : "image/*"}
            multiple={activeTool === "image-to-pdf"}
            maxFiles={20}
            theme={theme}
          />
        </div>

        {/* Format Selector for PDF to Image */}
        {activeTool === "pdf-to-image" && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
              Image Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.bg,
                color: themeColors.text,
                borderColor: themeColors.border,
              }}
            >
              <option value="PNG">PNG</option>
              <option value="JPG">JPG</option>
              <option value="JPEG">JPEG</option>
            </select>
          </div>
        )}

        {/* Progress Bar */}
        {processing && (
          <div className="mb-6">
            <ProgressBar progress={progress} label="Converting..." theme={theme} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {activeTool === "pdf-to-image" && (
            <Button
              onClick={handlePdfToImage}
              disabled={processing || !files[0]}
              theme={theme}
            >
              <ArrowRightLeft size={18} className="mr-2" />
              Convert to {format}
            </Button>
          )}
          {activeTool === "image-to-pdf" && (
            <Button
              onClick={handleImageToPdf}
              disabled={processing || files.length === 0}
              theme={theme}
            >
              <ArrowRightLeft size={18} className="mr-2" />
              Convert to PDF ({files.length} images)
            </Button>
          )}
          {result && (
            <Button
              onClick={downloadResult}
              variant="secondary"
              theme={theme}
            >
              <FileDown size={18} className="mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Convert;

