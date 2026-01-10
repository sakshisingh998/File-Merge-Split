import React from "react";
import { Loader2 } from "lucide-react";

function LoadingSpinner({ message = "Processing..." }) {
  return (
    <div className="flex items-center gap-2 text-white">
      <Loader2 className="animate-spin" size={20} />
      <span>{message}</span>
    </div>
  );
}

export default LoadingSpinner;
