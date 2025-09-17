// src/components/HelpModal.jsx
import React from "react";

function HelpModal({ isOpen, onClose, cardType }) {
  if (!isOpen) return null;

  const helpContent = {
    split: {
      title: "Split PDF Help",
      content: [
        "• Upload a PDF file using the file input",
        "• Enter page ranges (e.g., '1-3,5-7' or '1,3,5')",
        "• Click Split to create separate PDF files",
        "• Use commas to separate multiple ranges",
        "• Use hyphens for continuous page ranges"
      ]
    },
    merge: {
      title: "Merge PDFs Help",
      content: [
        "• Select multiple PDF files to merge",
        "• Files will be merged in the order shown",
        "• Use the trash icon to remove unwanted files",
        "• Drag files to reorder (if supported)",
        "• Click Merge to combine all files into one PDF"
      ]
    },
    extract: {
      title: "Extract & Summarize Help",
      content: [
        "• Upload a PDF file for processing",
        "• Extract: Get plain text from the PDF",
        "• Summarize: Get AI-generated summary",
        "• Both operations preserve original formatting when possible",
        "• Large files may take longer to process"
      ]
    }
  };

  const content = helpContent[cardType] || helpContent.split;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{content.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <ul className="text-gray-600 space-y-2">
          {content.content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HelpModal;