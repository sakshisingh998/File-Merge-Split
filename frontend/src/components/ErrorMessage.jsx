import React from "react";

function ErrorMessage({ message, className = "" }) {
  if (!message) return null;
  
  return (
    <div className={`p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm ${className}`}>
      {message}
    </div>
  );
}

export default ErrorMessage;
