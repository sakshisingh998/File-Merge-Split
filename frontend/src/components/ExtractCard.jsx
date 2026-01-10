// src/components/ExtractCard.jsx
import React, { useState } from "react";
import { FileText, FileDown, HelpCircle, Download } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import FileInput from "./FileInput";
import { extractText, summarizeText } from "../api/api";
import theme from "../config/theme";

function ExtractCard() {
  const [file, setFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [operation, setOperation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleOperation = (op) => {
    if (!file) {
      alert("Please select a PDF file first");
      return;
    }
    setOperation(op);
    setShowConfirm(true);
  };

  const confirmOperation = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setExtractedText(null);
    setSummary(null);

    try {
      if (operation === "Extract") {
        const response = await extractText(file);
        if (response.status === "success") {
          setExtractedText(response.extractedText);
        } else {
          setError(response.message || "Failed to extract text");
        }
      } else if (operation === "Summarize") {
        const response = await summarizeText(file);
        if (response.status === "success") {
          setSummary(response.summary);
          // Also extract text for display
          const extractResponse = await extractText(file);
          if (extractResponse.status === "success") {
            setExtractedText(extractResponse.extractedText);
          }
        } else {
          setError(response.message || "Failed to summarize text");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${operation.toLowerCase()} text. Please try again.`);
      console.error(`${operation} error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setExtractedText(null);
    setSummary(null);
  };

  return (
    <>
      <div
        className="p-8 rounded-2xl shadow-2xl flex flex-col items-center min-h-[400px] justify-between relative"
        style={{
          backgroundImage: theme.colors.card.extract,
          color: theme.colors.card.text,
        }}
      >
        <button
          onClick={() => setShowHelp(true)}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={24} />
        </button>

        <div className="text-center mb-6">
          <FileText size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Extract & Summarize</h2>
          <p className="opacity-80 text-sm">Extract text and summarize content using advanced AI algorithms to save time and enhance productivity.</p>
        </div>

        <FileInput
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-6 w-full max-w-sm"
        />

        <ErrorMessage message={error} className="w-full max-w-sm mb-4" />

        {isLoading ? (
          <LoadingSpinner message="Processing..." className="mb-6" />
        ) : extractedText || summary ? (
          <div className="w-full max-w-sm space-y-4 mb-6">
            {extractedText && (
              <div className="p-4 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Extracted Text</h3>
                  <Button
                    onClick={() => downloadText(extractedText, file?.name?.replace('.pdf', '_extracted.txt') || 'extracted.txt')}
                    variant="secondary"
                    className="text-xs py-1 px-2 flex items-center gap-1"
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
                <div className="text-sm text-white bg-black bg-opacity-20 p-2 rounded max-h-32 overflow-y-auto">
                  {extractedText.substring(0, 200)}...
                </div>
              </div>
            )}
            {summary && (
              <div className="p-4 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Summary</h3>
                  <Button
                    onClick={() => downloadText(summary, file?.name?.replace('.pdf', '_summary.txt') || 'summary.txt')}
                    variant="secondary"
                    className="text-xs py-1 px-2 flex items-center gap-1"
                  >
                    <Download size={14} />
                    Download
                  </Button>
                </div>
                <div className="text-sm text-white bg-black bg-opacity-20 p-2 rounded max-h-32 overflow-y-auto">
                  {summary}
                </div>
              </div>
            )}
            <Button 
              onClick={() => {
                setFile(null);
                setExtractedText(null);
                setSummary(null);
                setError(null);
              }} 
              variant="secondary"
              className="w-full text-sm"
            >
              Process Another
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button onClick={() => handleOperation("Extract")} disabled={!file}>
              <FileDown size={20} className="mr-2" />
              Extract
            </Button>
            <Button onClick={() => handleOperation("Summarize")} variant="secondary" disabled={!file}>
              Summarize
            </Button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmOperation}
        title={`Confirm ${operation}`}
        message={`${operation} content from "${file?.name}"?`}
        type="success"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="extract"
      />
    </>
  );
}

export default ExtractCard;