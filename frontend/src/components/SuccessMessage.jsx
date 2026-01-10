import React from "react";
import { Download } from "lucide-react";
import Button from "./Button";

function SuccessMessage({ message, downloadLabel, onDownload, onReset, className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="text-green-200 text-sm font-semibold">
        ✓ {message}
      </div>
      {onDownload && (
        <Button onClick={onDownload} variant="default" className="flex items-center gap-2">
          <Download size={20} />
          {downloadLabel}
        </Button>
      )}
      {onReset && (
        <Button onClick={onReset} variant="secondary" className="text-sm">
          Process Another
        </Button>
      )}
    </div>
  );
}

export default SuccessMessage;
