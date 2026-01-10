import React from "react";
import theme from "../config/theme";

function TextInput({ placeholder, value, onChange, className = "" }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 rounded-lg text-center border-2 transition-all duration-200
                 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none ${className}`}
      style={{
        backgroundColor: theme.colors.button.bg,
        color: theme.colors.button.text,
        borderColor: theme.colors.background,
      }}
    />
  );
}

export default TextInput;
