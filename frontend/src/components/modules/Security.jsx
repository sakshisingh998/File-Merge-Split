// src/components/modules/Security.jsx - Security Module (Password Protection & Digital Signing)
import React, { useState, useRef, useEffect } from "react";
import { Lock, Unlock, PenTool, FileDown } from "lucide-react";
import DragDropUpload from "../DragDropUpload";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import Toast from "../Toast";
import { protectPdf, unlockPdf, signPdf } from "../../api/api";

function Security({ theme, initialTool = null }) {
  const [activeTool, setActiveTool] = useState("protect");

  // Set initial tool when component mounts or initialTool changes
  useEffect(() => {
    if (initialTool && (initialTool === "protect" || initialTool === "unlock" || initialTool === "sign")) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [signatureImage, setSignatureImage] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [result, setResult] = useState(null);

  const themeColors = theme === "dark"
    ? {
        bg: "#1F1515",
        surface: "#2B1D1D",
        text: "#FAF7F5",
        textSecondary: "#D4C7C0",
        border: "#3F2E2E",
        accent: "#E0B089",
      }
    : {
        bg: "#FAF7F5",
        surface: "#FFFFFF",
        text: "#2B1D1D",
        textSecondary: "#7A5C58",
        border: "#E5DED9",
        accent: "#E0B089",
      };

  const tools = [
    { id: "protect", label: "Protect PDF", icon: Lock, description: "Add password protection" },
    { id: "unlock", label: "Unlock PDF", icon: Unlock, description: "Remove password protection" },
    { id: "sign", label: "Sign PDF", icon: PenTool, description: "Add digital signature" },
  ];

  const handleFileSelected = (files) => {
    setFile(files[0] || null);
    setResult(null);
  };

  const handleProtect = async () => {
    if (!file || !password) {
      setToast({ message: "Please select a file and enter a password", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const pdfArrayBuffer = await protectPdf(file, password);
      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      setResult({ type: "pdf", blob, filename: `protected_${file.name}` });
      setProgress(100);
      setToast({ message: "PDF protected successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Protection failed", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleUnlock = async () => {
    if (!file || !password) {
      setToast({ message: "Please select a file and enter the password", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      const pdfArrayBuffer = await unlockPdf(file, password);
      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      setResult({ type: "pdf", blob, filename: `unlocked_${file.name}` });
      setProgress(100);
      setToast({ message: "PDF unlocked successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Unlock failed. Check password.", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  // Signature Canvas Functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    setSignatureImage(imageData);
    setToast({ message: "Signature saved!", type: "success" });
  };

  const handleSign = async () => {
    if (!file) {
      setToast({ message: "Please select a PDF file", type: "error" });
      return;
    }

    if (!signatureImage) {
      setToast({ message: "Please create or upload a signature", type: "error" });
      return;
    }

    setProcessing(true);
    setProgress(30);

    try {
      // Convert data URL to base64
      const base64Data = signatureImage.split(",")[1];
      const pdfArrayBuffer = await signPdf(file, base64Data, 0, 0, 200, 100);
      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      setResult({ type: "pdf", blob, filename: `signed_${file.name}` });
      setProgress(100);
      setToast({ message: "PDF signed successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Signing failed", type: "error" });
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignatureImage(event.target.result);
        // Draw on canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    const url = window.URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CurrentTool = tools.find(t => t.id === activeTool);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: themeColors.text }}>
          Security
        </h1>
        <p className="text-sm" style={{ color: themeColors.textSecondary }}>
          Protect, unlock, and sign your PDF documents
        </p>
      </div>

      {/* Tool Selector */}
      <div className="flex gap-2 flex-wrap">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setFile(null);
                setResult(null);
                setPassword("");
                if (tool.id !== "sign") {
                  setSignatureImage(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive ? "font-semibold" : ""
              }`}
              style={{
                backgroundColor: isActive ? themeColors.accent : themeColors.surface,
                color: isActive ? "#FFFFFF" : themeColors.text,
                border: `1px solid ${isActive ? themeColors.accent : themeColors.border}`,
              }}
            >
              <Icon size={18} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Card */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: themeColors.surface,
          border: `1px solid ${themeColors.border}`,
        }}
      >
        {CurrentTool && (
          <div className="flex items-center gap-3 mb-6">
            <CurrentTool.icon size={24} style={{ color: themeColors.accent }} />
            <div>
              <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
                {CurrentTool.label}
              </h2>
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                {CurrentTool.description}
              </p>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-6">
          <DragDropUpload
            onFilesSelected={handleFileSelected}
            accept="application/pdf"
            multiple={false}
            theme={theme}
          />
        </div>

        {/* Password Input */}
        {(activeTool === "protect" || activeTool === "unlock") && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
              {activeTool === "protect" ? "Set Password" : "Enter Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTool === "protect" ? "Enter password" : "Enter PDF password"}
              className="w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeColors.bg,
                color: themeColors.text,
                borderColor: themeColors.border,
              }}
            />
          </div>
        )}

        {/* Signature Canvas for Sign Tool */}
        {activeTool === "sign" && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
              Create Signature
            </label>
            <div
              className="border-2 rounded-lg mb-3"
              style={{ borderColor: themeColors.border }}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full"
                style={{
                  backgroundColor: themeColors.bg,
                  border: `1px solid ${themeColors.border}`,
                }}
              />
            </div>
            <div className="flex gap-2 mb-3">
              <Button
                onClick={saveSignature}
                variant="secondary"
                theme={theme}
                className="flex-1"
              >
                Save Signature
              </Button>
              <Button
                onClick={clearSignature}
                variant="outline"
                theme={theme}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text }}>
                Or Upload Signature Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureUpload}
                className="w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: themeColors.bg,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {processing && (
          <div className="mb-6">
            <ProgressBar progress={progress} label="Processing..." theme={theme} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {activeTool === "protect" && (
            <Button
              onClick={handleProtect}
              disabled={processing || !file || !password}
              theme={theme}
            >
              <Lock size={18} className="mr-2" />
              Protect PDF
            </Button>
          )}
          {activeTool === "unlock" && (
            <Button
              onClick={handleUnlock}
              disabled={processing || !file || !password}
              theme={theme}
            >
              <Unlock size={18} className="mr-2" />
              Unlock PDF
            </Button>
          )}
          {activeTool === "sign" && (
            <Button
              onClick={handleSign}
              disabled={processing || !file || !signatureImage}
              theme={theme}
            >
              <PenTool size={18} className="mr-2" />
              Sign PDF
            </Button>
          )}
          {result && (
            <Button
              onClick={downloadResult}
              variant="secondary"
              theme={theme}
            >
              <FileDown size={18} className="mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Security;

