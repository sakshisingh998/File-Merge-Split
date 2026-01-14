// src/components/modules/AITools.jsx - AI Tools Module
import React, { useState } from "react";
import { Sparkles, Copy, FileDown, CheckCircle2, Loader2 } from "lucide-react";
import DragDropUpload from "../DragDropUpload";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import Toast from "../Toast";
import { summarizeText } from "../../api/api";
import axios from "axios";

function AITools({ theme }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        surface: "#2B1D1D",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        border: "#3F2E2E",
        accent: "#E0B089",
        aiGradient: "linear-gradient(135deg, #E0B089 0%, #D49A6B 100%)",
      }
    : {
        bg: "#FAF7F5",
        surface: "#FFFFFF",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        border: "#E5DED9",
        accent: "#E0B089",
        aiGradient: "linear-gradient(135deg, #E0B089 0%, #D49A6B 100%)",
      };

  const handleFileSelected = (files) => {
    setFile(files[0] || null);
    setSummary("");
  };

  const handleSummarize = async () => {
    if (!file) {
      setToast({ message: "Please select a PDF file", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(20);

    try {
      setProgress(50);
      const result = await summarizeText(file);
      setSummary(result.summary || result.extractedText || "Summary generated successfully.");
      setProgress(100);
      setToast({ message: "AI summary generated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "AI summarization failed", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setToast({ message: "Copied to clipboard!", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({ message: "Failed to copy", type: "error" });
    }
  };

  const handleDownloadPDF = async () => {
    if (!summary) {
      setToast({ message: "No summary to download", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/pdf/download-pdf",
        {
          title: "AI Summary",
          bodyText: summary,
          fileName: "ai_summary",
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_summary.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      setToast({ message: "PDF downloaded successfully!", type: "success" });
    } catch {
      setToast({ message: "PDF download failed", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold" style={{ color: themeColors.text }}>
            AI Tools
          </h1>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{
              background: themeColors.aiGradient,
              color: "#FFFFFF",
            }}
          >
            <Sparkles size={14} />
            <span>Powered by Gemini</span>
          </div>
        </div>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          AI-powered PDF summarization with advanced natural language processing
        </p>
      </div>

      {/* AI Summary Card */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: themeColors.aiGradient }}
          >
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
              AI Summary
            </h2>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              Get intelligent summaries of your PDF documents
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <DragDropUpload
            onFilesSelected={handleFileSelected}
            accept="application/pdf"
            multiple={false}
            theme={theme}
          />
        </div>

        {/* Progress Bar */}
        {processing && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 size={16} className="animate-spin" style={{ color: themeColors.accent }} />
              <span className="text-sm font-medium" style={{ color: themeColors.text }}>
                ⚡ AI Processing...
              </span>
            </div>
            <ProgressBar progress={progress} theme={theme} />
            <p className="text-xs mt-2" style={{ color: themeColors.textSecondary }}>
              Analyzing document content with Gemini AI
            </p>
          </div>
        )}

        {/* Summary Output */}
        {summary && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} style={{ color: "#10B981" }} />
                <span className="text-sm font-semibold" style={{ color: themeColors.text }}>
                  Summary Generated
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: themeColors.bg,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: themeColors.accent,
                    color: "#FFFFFF",
                  }}
                >
                  <FileDown size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
            <div
              className="p-4 rounded-lg max-h-96 overflow-y-auto"
              style={{
                backgroundColor: themeColors.bg,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: themeColors.text }}>
                {summary}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleSummarize}
          disabled={processing || !file}
          theme={theme}
          className="w-full"
          style={{
            background: themeColors.aiGradient,
            color: "#FFFFFF",
            border: "none",
          }}
        >
          {processing ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Processing with AI...
            </>
          ) : (
            <>
              <Sparkles size={18} className="mr-2" />
              Generate AI Summary
            </>
          )}
        </Button>

        {/* AI Info */}
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: themeColors.bg }}>
          <p className="text-xs" style={{ color: themeColors.textSecondary }}>
            <strong style={{ color: themeColors.accent }}>Powered by Gemini 2.5 Flash</strong>
            {" • "}
            Advanced AI analyzes your document structure and content to generate comprehensive summaries
          </p>
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

export default AITools;

