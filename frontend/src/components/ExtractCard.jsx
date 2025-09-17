// src/components/ExtractCard.jsx
import React, { useState } from "react";
import { FileText, FileDown, HelpCircle } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import theme from "../config/theme";

function ExtractCard() {
  const [file, setFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [operation, setOperation] = useState("");

  const handleOperation = (op) => {
    if (!file) {
      alert("Please select a PDF file first");
      return;
    }
    setOperation(op);
    setShowConfirm(true);
  };

  const confirmOperation = () => {
    console.log(`${operation} PDF:`, file.name);
    setShowConfirm(false);
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

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6 p-3 rounded-lg w-full max-w-sm text-center border-2 transition-all duration-200
                     focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
          style={{
            backgroundColor: theme.colors.button.bg,
            color: theme.colors.button.text,
            borderColor: theme.colors.background,
          }}
        />

        <div className="flex gap-4">
          <Button onClick={() => handleOperation("Extract")}>
            <FileDown size={20} className="mr-2" />
            Extract
          </Button>
          <Button onClick={() => handleOperation("Summarize")} variant="secondary">
            Summarize
          </Button>
        </div>
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