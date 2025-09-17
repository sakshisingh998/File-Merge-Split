// src/components/SplitCard.jsx
import React, { useState } from "react";
import { Split, HelpCircle } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import theme from "../config/theme";

function SplitCard() {
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSplit = () => {
    if (!file || !ranges) {
      alert("Please select a file and enter page ranges");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSplit = () => {
    // Process split logic here
    console.log("Splitting PDF:", file.name, "Ranges:", ranges);
    setShowConfirm(false);
    // Reset form or show success message
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
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 rounded-lg text-center border-2 transition-all duration-200 
                       focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
            style={{
              backgroundColor: theme.colors.button.bg,
              color: theme.colors.button.text,
              borderColor: theme.colors.background,
            }}
          />

          <input
            type="text"
            placeholder="Enter ranges (e.g. 1-3,5-7)"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            className="w-full p-3 rounded-lg text-center border-2 transition-all duration-200
                       focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
            style={{
              backgroundColor: theme.colors.button.bg,
              color: theme.colors.button.text,
              borderColor: theme.colors.background,
            }}
          />
        </div>

        <Button onClick={handleSplit} className="mt-6">
          Split PDF
        </Button>
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