// src/components/Toast.jsx - Status Toast Notifications
import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

function Toast({ message, type = "info", onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: "#ECFDF5",
      border: "#10B981",
      text: "#065F46",
      icon: "#10B981",
    },
    error: {
      bg: "#FEF2F2",
      border: "#EF4444",
      text: "#991B1B",
      icon: "#EF4444",
    },
    warning: {
      bg: "#FFFBEB",
      border: "#F59E0B",
      text: "#92400E",
      icon: "#F59E0B",
    },
    info: {
      bg: "#EFF6FF",
      border: "#3B82F6",
      text: "#1E40AF",
      icon: "#3B82F6",
    },
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <div
      className="fixed top-20 right-6 z-50 animate-slide-in-right min-w-[300px] max-w-md rounded-lg shadow-xl border-l-4 p-4 flex items-start gap-3"
      style={{
        backgroundColor: colorScheme.bg,
        borderLeftColor: colorScheme.border,
      }}
    >
      <Icon size={20} style={{ color: colorScheme.icon }} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: colorScheme.text }}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-opacity-20 transition-colors"
        style={{ color: colorScheme.icon }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;

