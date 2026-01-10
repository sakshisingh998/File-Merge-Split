// src/components/MergeCard.jsx
import React, { useState } from "react";
import { Merge, HelpCircle } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import FileInput from "./FileInput";
import FileList from "./FileList";
import { mergeFiles, downloadBlob } from "../api/api";
import theme from "../config/theme";

function MergeCard() {
  const [files, setFiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedBlob, setMergedBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    setMergedBlob(null);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setError(null);
    setMergedBlob(null);
  };

  const handleMerge = () => {
    if (files.length < 2) {
      alert("Please select at least 2 files to merge");
      return;
    }
    setShowConfirm(true);
  };

  const confirmMerge = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setMergedBlob(null);

    try {
      const blob = await mergeFiles(files);
      setMergedBlob(blob);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to merge PDFs. Please try again.");
      console.error("Merge error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, "merged.pdf");
    }
  };

  return (
    <>
      <div
        className="p-8 rounded-2xl shadow-2xl flex flex-col items-center min-h-[400px] justify-between
                   transition-all duration-500 transform hover:scale-102 relative"
        style={{
          backgroundImage: theme.colors.card.split,
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
          <Merge size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Merge PDFs</h2>
          <p className="opacity-80 text-sm">Combine multiple PDF files into a single cohesive document with ease.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <FileInput
            accept="application/pdf"
            multiple
            onChange={handleFiles}
          />
          <FileList files={files} onRemove={removeFile} />
        </div>

        <ErrorMessage message={error} className="w-full max-w-sm mt-4" />

        {isLoading ? (
          <LoadingSpinner message="Merging PDFs..." className="mt-6" />
        ) : mergedBlob ? (
          <SuccessMessage
            message="PDFs merged successfully!"
            downloadLabel="Download Merged PDF"
            onDownload={handleDownload}
            onReset={() => {
              setFiles([]);
              setMergedBlob(null);
              setError(null);
            }}
            className="mt-6"
          />
        ) : (
          <Button onClick={handleMerge} variant="default" className="mt-6" disabled={files.length < 2}>
            Merge PDFs ({files.length})
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmMerge}
        title="Confirm Merge"
        message={`Merge ${files.length} PDF files into one document?`}
        type="success"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="merge"
      />
    </>
  );
}

export default MergeCard;