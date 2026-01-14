// src/components/DragDropUpload.jsx - Premium Drag & Drop File Upload
import React, { useRef, useState } from "react";
import { Upload, File, X, CheckCircle2 } from "lucide-react";

function DragDropUpload({ 
  onFilesSelected, 
  accept = "application/pdf", 
  multiple = false,
  maxFiles = 10,
  theme = "light"
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        border: "#3F2E2E",
        borderHover: "#4A3A3A",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        accent: "#E0B089",
        surface: "#2B1D1D",
      }
    : {
        bg: "#FFFFFF",
        border: "#E5DED9",
        borderHover: "#D4C7C0",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        accent: "#E0B089",
        surface: "#FAF7F5",
      };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === accept || accept === "*"
    );

    if (files.length > 0) {
      const filesToAdd = multiple 
        ? [...selectedFiles, ...files].slice(0, maxFiles)
        : [files[0]];
      
      setSelectedFiles(filesToAdd);
      onFilesSelected(filesToAdd);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const filesToAdd = multiple 
        ? [...selectedFiles, ...files].slice(0, maxFiles)
        : [files[0]];
      
      setSelectedFiles(filesToAdd);
      onFilesSelected(filesToAdd);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group ${
          isDragging ? "scale-[1.02]" : ""
        }`}
        style={{
          backgroundColor: isDragging ? themeColors.surface : themeColors.bg,
          borderColor: isDragging ? themeColors.accent : themeColors.border,
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = themeColors.borderHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = themeColors.border;
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: themeColors.accent + "15",
            }}
          >
            <Upload
              size={32}
              style={{ color: themeColors.accent }}
              className={isDragging ? "animate-bounce" : ""}
            />
          </div>

          <p className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm mb-4" style={{ color: themeColors.textSecondary }}>
            or click to browse
          </p>
          <p className="text-xs" style={{ color: themeColors.textSecondary, opacity: 0.7 }}>
            {accept === "application/pdf" ? "PDF files only" : "All file types"}
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
              style={{
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File size={20} style={{ color: themeColors.accent }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: themeColors.text }}>
                    {file.name}
                  </p>
                  <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: "#10B981" }} />
                {multiple && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 rounded hover:bg-opacity-20 transition-colors"
                    style={{ color: "#EF4444" }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DragDropUpload;

