// src/components/Header.jsx
import React from "react";
import theme from "../config/theme";

function Header() {
  return (
    <header className="text-center mb-8">
      <h1 className="text-5xl font-bold mb-2" style={{ color: theme.colors.primary }}>
        📑 PDF UTILITY SUITE
      </h1>
      <p className="text-lg opacity-80" style={{ color: theme.colors.secondary }}>
        Professional PDF management tools with enhanced productivity features
      </p>
    </header>
  );
}

export default Header;