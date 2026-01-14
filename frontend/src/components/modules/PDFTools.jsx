// src/components/modules/PDFTools.jsx - PDF Tools Module
import React, { useState, useEffect } from "react";
import { Split, FileDown, FileText, FilePlus } from "lucide-react";
import DragDropUpload from "../DragDropUpload";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import Toast from "../Toast";
import { splitFile, mergeFiles, extractText } from "../../api/api";

function PDFTools({ theme, initialTool = null }) {
  const [activeTool, setActiveTool] = useState("split");

  // Set initial tool when component mounts or initialTool changes
  useEffect(() => {
    if (initialTool && (initialTool === "split" || initialTool === "merge" || initialTool === "extract")) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);
  const [files, setFiles] = useState([]);
  const [ranges, setRanges] = useState("");
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
    { id: "split", label: "Split PDF", icon: Split, description: "Divide PDF by page ranges" },
    { id: "merge", label: "Merge PDFs", icon: FilePlus, description: "Combine multiple PDFs" },
    { id: "extract", label: "Extract Text", icon: FileText, description: "Extract text content" },
  ];

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSplit = async () => {
    if (!files[0] || !ranges) {
      setToast({ message: "Please select a file and enter page ranges", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const blob = await splitFile(files[0], ranges);
      setResult({ type: "zip", blob, filename: `${files[0].name.replace(".pdf", "")}-split.zip` });
      setProgress(100);
      setToast({ message: "PDF split successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Split failed", type: "error" });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setToast({ message: "Please select at least 2 files", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const blob = await mergeFiles(files);
      setResult({ type: "pdf", blob, filename: "merged.pdf" });
      setProgress(100);
      setToast({ message: "PDFs merged successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Merge failed", type: "error" });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleExtract = async () => {
    if (!files[0]) {
      setToast({ message: "Please select a PDF file", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const result = await extractText(files[0]);
      setResult({ type: "text", content: result.extractedText });
      setProgress(100);
      setToast({ message: "Text extracted successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Extraction failed", type: "error" });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    if (result.type === "zip" || result.type === "pdf") {
      const url = window.URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const CurrentTool = tools.find(t => t.id === activeTool);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text }}>
          PDF Tools
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          Split, merge, and extract content from your PDF documents
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
                setRanges("");
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
            accept="application/pdf"
            multiple={activeTool === "merge"}
            maxFiles={10}
            theme={theme}
          />
        </div>

        {/* Split-specific: Page Ranges */}
        {activeTool === "split" && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
              Page Ranges (e.g., 1-3,5-7)
            </label>
            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="1-3,5-7,10-15"
              className="w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.bg,
                color: themeColors.text,
                borderColor: themeColors.border,
                focusRingColor: themeColors.accent,
              }}
            />
          </div>
        )}

        {/* Progress Bar */}
        {processing && (
          <div className="mb-6">
            <ProgressBar progress={progress} label="Processing..." theme={theme} />
          </div>
        )}

        {/* Result Display */}
        {result && result.type === "text" && (
          <div
            className="mb-6 p-4 rounded-lg max-h-64 overflow-y-auto"
            style={{
              backgroundColor: themeColors.bg,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <p className="text-sm whitespace-pre-wrap" style={{ color: themeColors.text }}>
              {result.content}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {activeTool === "split" && (
            <Button
              onClick={handleSplit}
              disabled={processing || !files[0] || !ranges}
              theme={theme}
            >
              Split PDF
            </Button>
          )}
          {activeTool === "merge" && (
            <Button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              theme={theme}
            >
              Merge PDFs ({files.length})
            </Button>
          )}
          {activeTool === "extract" && (
            <Button
              onClick={handleExtract}
              disabled={processing || !files[0]}
              theme={theme}
            >
              Extract Text
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

export default PDFTools;

