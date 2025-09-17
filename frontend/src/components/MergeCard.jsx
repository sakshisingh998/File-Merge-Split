// src/components/MergeCard.jsx
import React, { useState } from "react";
import { Merge, HelpCircle } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import theme from "../config/theme";

function MergeCard() {
  const [files, setFiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = () => {
    if (files.length < 2) {
      alert("Please select at least 2 files to merge");
      return;
    }
    setShowConfirm(true);
  };

  const confirmMerge = () => {
    console.log("Merging PDFs:", files.map(f => f.name));
    setShowConfirm(false);
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
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFiles}
            className="w-full p-3 rounded-lg text-center border-2 transition-all duration-200
                       focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
            style={{
              backgroundColor: theme.colors.button.bg,
              color: theme.colors.button.text,
              borderColor: theme.colors.background,
            }}
          />

          <div
            className="flex flex-col gap-2 w-full overflow-y-auto p-3 rounded-lg border-2"
            style={{
              maxHeight: "120px",
              borderColor: theme.colors.background,
              backgroundColor: theme.colors.button.bg,
            }}
          >
            {files.length === 0 ? (
              <p className="text-sm opacity-70 text-center py-4">No files selected</p>
            ) : (
              files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: theme.colors.card.bg,
                    color: theme.colors.card.text,
                    borderColor: theme.colors.background,
                  }}
                >
                  <span className="truncate text-sm flex-1">{file.name}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <Button onClick={handleMerge} variant="default" className="mt-6">
          Merge PDFs ({files.length})
        </Button>
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