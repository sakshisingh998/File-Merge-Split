// src/components/Button.jsx
import React from "react";
import theme from "../config/theme";

function Button({ children, onClick, variant = "default", className = "", disabled = false }) {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const getButtonStyle = (variant) => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.card.text,
          border: `2px solid ${theme.colors.accent}`
        };
      case "success":
        return {
          backgroundColor: "#10B981",
          color: "white",
          border: "2px solid #10B981"
        };
      case "danger":
        return {
          backgroundColor: "#EF4444",
          color: "white",
          border: "2px solid #EF4444"
        };
      default:
        return {
          backgroundColor: theme.colors.button.bg,
          color: theme.colors.button.text,
          border: `2px solid ${theme.colors.button.border}`
        };
    }
  };

  const getHoverStyle = () => ({
    backgroundColor: variant === "secondary" ? theme.colors.accent :
                    variant === "success" ? "#059669" :
                    variant === "danger" ? "#DC2626" :
                    theme.colors.button.hoverBg
  });

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100" : "";
  const buttonStyle = getButtonStyle(variant);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hoverStyle = getHoverStyle();
          e.target.style.backgroundColor = hoverStyle.backgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = buttonStyle.backgroundColor;
        }
      }}
    >
      {children}
    </button>
  );
}

export default Button;