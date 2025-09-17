// src/components/Header.jsx
import React from "react";
import theme from "../config/theme";

function Header() {
  return (
    <header className={`bg-[${theme.colors.primary}] text-[${theme.colors.text}] py-6 px-6`}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          📑 PDF UTILITY SUITE
        </h1>
        <p className="text-lg text-[${theme.colors.accent}]">
          Professional PDF management tools with enhanced productivity features
        </p>
      </div>
    </header>
  );
}

export default Header;
