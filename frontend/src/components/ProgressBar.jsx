// src/components/ProgressBar.jsx - Progress Indicator
import React from "react";

function ProgressBar({ progress = 0, label = "Processing...", theme = "light" }) {
  const themeColors = theme === "dark"
    ? {
        bg: "#3F2E2E",
        fill: "#E0B089",
        text: "#FAF7F5",
      }
    : {
        bg: "#E5DED9",
        fill: "#E0B089",
        text: "#2B1D1D",
      };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: themeColors.text }}>
            {label}
          </span>
          <span className="text-sm" style={{ color: themeColors.text, opacity: 0.7 }}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: themeColors.bg }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: themeColors.fill,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
