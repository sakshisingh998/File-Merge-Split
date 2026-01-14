// src/components/Button.jsx - Premium SaaS Button Component
import React from "react";

function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "", 
  disabled = false,
  theme = "light",
  style = {}
}) {
  const themeColors = theme === "dark"
    ? {
        primary: {
          bg: "#E0B089",
          text: "#2B1D1D",
          hover: "#D49A6B",
        },
        secondary: {
          bg: "#3F2E2E",
          text: "#FAF7F5",
          hover: "#4A3A3A",
        },
        outline: {
          bg: "transparent",
          text: "#FAF7F5",
          border: "#3F2E2E",
          hover: "#3F2E2E",
        },
      }
    : {
        primary: {
          bg: "#E0B089",
          text: "#2B1D1D",
          hover: "#D49A6B",
        },
        secondary: {
          bg: "#FAF7F5",
          text: "#2B1D1D",
          hover: "#F2E5D5",
        },
        outline: {
          bg: "transparent",
          text: "#2B1D1D",
          border: "#E5DED9",
          hover: "#FAF7F5",
        },
      };

  const getButtonColors = () => {
    switch (variant) {
      case "secondary":
        return themeColors.secondary;
      case "outline":
        return themeColors.outline;
      default:
        return themeColors.primary;
    }
  };

  const colors = getButtonColors();
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100" 
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabledClasses} ${className}`}
      style={{
        backgroundColor: variant === "outline" ? colors.bg : colors.bg,
        color: colors.text,
        border: variant === "outline" ? `1px solid ${colors.border}` : "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variant === "outline" ? colors.bg : colors.bg;
        }
      }}
    >
      {children}
    </button>
  );
}

export default Button;
