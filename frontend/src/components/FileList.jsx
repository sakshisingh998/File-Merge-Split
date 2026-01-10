import React from "react";
import theme from "../config/theme";

function FileList({ files, onRemove }) {
  if (files.length === 0) {
    return (
      <p className="text-sm opacity-70 text-center py-4">No files selected</p>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 w-full overflow-y-auto p-3 rounded-lg border-2"
      style={{
        maxHeight: "120px",
        borderColor: theme.colors.background,
        backgroundColor: theme.colors.button.bg,
      }}
    >
      {files.map((file, idx) => (
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
          {onRemove && (
            <button
              onClick={() => onRemove(idx)}
              className="ml-2 text-red-400 hover:text-red-300 transition-colors"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default FileList;
