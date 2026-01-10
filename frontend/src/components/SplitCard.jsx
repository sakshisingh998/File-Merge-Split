// src/components/SplitCard.jsx
import React, { useState } from "react";
import { Split, HelpCircle } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import FileInput from "./FileInput";
import TextInput from "./TextInput";
import { splitFile, downloadBlob } from "../api/api";
import theme from "../config/theme";

function SplitCard() {
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [splitBlob, setSplitBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleSplit = () => {
    if (!file || !ranges) {
      alert("Please select a file and enter page ranges");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSplit = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setSplitBlob(null);

    try {
      const blob = await splitFile(file, ranges);
      setSplitBlob(blob);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to split PDF. Please check your page ranges and try again.");
      console.error("Split error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (splitBlob) {
      const fileName = file?.name 
        ? file.name.replace('.pdf', '') + '_split.zip'
        : 'split_parts.zip';
      downloadBlob(splitBlob, fileName);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSplitBlob(null);
  };

  const handleRangesChange = (e) => {
    setRanges(e.target.value);
    setError(null);
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
          <Split size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Split PDF</h2>
          <p className="opacity-80 text-sm">Effortlessly split your PDF documents into multiple files based on your specifications.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <FileInput
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <TextInput
            placeholder="Enter ranges (e.g. 1-3,5-7)"
            value={ranges}
            onChange={handleRangesChange}
          />
        </div>

        <ErrorMessage message={error} className="w-full max-w-sm mt-4" />

        {isLoading ? (
          <LoadingSpinner message="Splitting PDF..." className="mt-6" />
        ) : splitBlob ? (
          <SuccessMessage
            message="PDF split successfully!"
            downloadLabel="Download Split Files (ZIP)"
            onDownload={handleDownload}
            onReset={() => {
              setFile(null);
              setRanges("");
              setSplitBlob(null);
              setError(null);
            }}
            className="mt-6"
          />
        ) : (
          <Button onClick={handleSplit} className="mt-6" disabled={!file || !ranges}>
            Split PDF
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSplit}
        title="Confirm Split"
        message={`Split "${file?.name}" with ranges "${ranges}"?`}
        type="warning"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="split"
      />
    </>
  );
}

export default SplitCard;