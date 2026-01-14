// src/components/TopBar.jsx - SaaS Top Navigation Bar
import React from "react";
import { Moon, Sun } from "lucide-react";

function TopBar({ theme, onThemeToggle }) {
  const themeColors = theme === "dark"
    ? {
        bg: "#2B1D1D",
        text: "#FAF7F5",
        border: "#3F2E2E",
        hover: "#3F2E2E",
      }
    : {
        bg: "#FFFFFF",
        text: "#2B1D1D",
        border: "#E5DED9",
        hover: "#FAF7F5",
      };

  return (
    <header
      className="fixed top-0 right-0 h-16 z-30 transition-all duration-300 border-b"
      style={{
        left: "256px", // 64 * 4 (sidebar width)
        backgroundColor: themeColors.bg,
        borderColor: themeColors.border,
      }}
    >
      <div className="h-full flex items-center justify-end px-6">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: theme === "dark" ? "#334155" : "#F1F5F9",
              color: themeColors.text,
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
