// src/components/ConfirmationModal.jsx
import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Button from "./Button";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = "warning" }) {
  if (!isOpen) return null;

  const iconMap = {
    warning: <AlertTriangle className="text-yellow-500" size={24} />,
    success: <CheckCircle className="text-green-500" size={24} />,
    danger: <AlertTriangle className="text-red-500" size={24} />
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          {iconMap[type]}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={onConfirm} variant={type === "danger" ? "danger" : "default"}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;