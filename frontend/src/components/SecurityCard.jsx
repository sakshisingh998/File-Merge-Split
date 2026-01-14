// src/components/SecurityCard.jsx
import React, { useState } from "react";
import { Lock, Unlock, HelpCircle, Download, Loader2 } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import FileInput from "./FileInput";
import TextInput from "./TextInput";
import { protectPdf, unlockPdf, downloadBlob } from "../api/api";
import theme from "../config/theme";

function SecurityCard() {
  const [operation, setOperation] = useState("protect");
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResultBlob(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleSecurity = () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    if (!password) {
      alert("Please enter a password");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSecurity = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setResultBlob(null);

    try {
      const blob = operation === "protect" 
        ? await protectPdf(file, password)
        : await unlockPdf(file, password);
      setResultBlob(blob);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${operation} PDF. Please check your password and try again.`);
      console.error("Security error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      const fileName = operation === "protect"
        ? `protected_${file?.name || "document.pdf"}`
        : `unlocked_${file?.name || "document.pdf"}`;
      downloadBlob(resultBlob, fileName);
    }
  };

  return (
    <>
      <div
        className="p-8 rounded-2xl shadow-2xl flex flex-col items-center min-h-[400px] justify-between
                   transition-all duration-500 transform hover:scale-102 relative"
        style={{
          backgroundImage: theme.colors.card.split,
          color: theme.colors.card.text,
        }}
      >
        <button
          onClick={() => setShowHelp(true)}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={24} />
        </button>

        <div className="text-center mb-6">
          {operation === "protect" ? (
            <Lock size={48} className="mx-auto mb-4" />
          ) : (
            <Unlock size={48} className="mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold mb-2">
            {operation === "protect" ? "Protect PDF" : "Unlock PDF"}
          </h2>
          <p className="opacity-80 text-sm">
            {operation === "protect" 
              ? "Add password protection to secure your PDF documents."
              : "Remove password protection from your PDF documents."}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setOperation("protect");
                setFile(null);
                setPassword("");
                setResultBlob(null);
                setError(null);
              }}
              variant={operation === "protect" ? "default" : "secondary"}
              className="flex-1 text-sm"
            >
              <Lock size={16} className="mr-1" />
              Protect
            </Button>
            <Button
              onClick={() => {
                setOperation("unlock");
                setFile(null);
                setPassword("");
                setResultBlob(null);
                setError(null);
              }}
              variant={operation === "unlock" ? "default" : "secondary"}
              className="flex-1 text-sm"
            >
              <Unlock size={16} className="mr-1" />
              Unlock
            </Button>
          </div>

          <FileInput
            accept="application/pdf"
            onChange={handleFileChange}
          />

          <TextInput
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <ErrorMessage message={error} className="w-full max-w-sm mt-4" />

        {isLoading ? (
          <LoadingSpinner message={operation === "protect" ? "Protecting PDF..." : "Unlocking PDF..."} className="mt-6" />
        ) : resultBlob ? (
          <SuccessMessage
            message={operation === "protect" ? "PDF protected successfully!" : "PDF unlocked successfully!"}
            downloadLabel={`Download ${operation === "protect" ? "Protected" : "Unlocked"} PDF`}
            onDownload={handleDownload}
            onReset={() => {
              setFile(null);
              setPassword("");
              setResultBlob(null);
              setError(null);
            }}
            className="mt-6"
          />
        ) : (
          <Button
            onClick={handleSecurity}
            className="mt-6"
            disabled={!file || !password}
          >
            {operation === "protect" ? "Protect PDF" : "Unlock PDF"}
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSecurity}
        title={`Confirm ${operation === "protect" ? "Protection" : "Unlock"}`}
        message={`${operation === "protect" ? "Protect" : "Unlock"} "${file?.name}" with password?`}
        type="warning"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="security"
      />
    </>
  );
}

export default SecurityCard;
