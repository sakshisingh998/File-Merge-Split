// src/components/SignCard.jsx
import React, { useState } from "react";
import { PenTool, HelpCircle, Download, Loader2 } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import FileInput from "./FileInput";
import { signPdf, downloadBlob } from "../api/api";
import theme from "../config/theme";

function SignCard() {
  const [file, setFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureBase64, setSignatureBase64] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signedBlob, setSignedBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSignedBlob(null);
  };

  const handleSignatureChange = (e) => {
    const sigFile = e.target.files[0];
    if (sigFile) {
      setSignatureFile(sigFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setSignatureBase64(base64String);
      };
      reader.readAsDataURL(sigFile);
    }
    setError(null);
  };

  const handleSign = () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    if (!signatureFile) {
      alert("Please select a signature image");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSign = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setSignedBlob(null);

    try {
      // Default position: bottom right
      const blob = await signPdf(file, signatureBase64, 0, 0, 200, 100);
      setSignedBlob(blob);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign PDF. Please try again.");
      console.error("Sign error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (signedBlob) {
      downloadBlob(signedBlob, `signed_${file?.name || "document.pdf"}`);
    }
  };

  return (
    <>
      <div
        className="p-8 rounded-2xl shadow-2xl flex flex-col items-center min-h-[400px] justify-between
                   transition-all duration-500 transform hover:scale-102 relative"
        style={{
          backgroundImage: theme.colors.card.merge,
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
          <PenTool size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Digital Signature</h2>
          <p className="opacity-80 text-sm">Add your digital signature to PDF documents.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <FileInput
            accept="application/pdf"
            onChange={handleFileChange}
          />

          <div>
            <FileInput
              accept="image/*"
              onChange={handleSignatureChange}
            />
            <p className="text-xs opacity-70 mt-1 text-center">
              Select signature image (PNG, JPG, etc.)
            </p>
          </div>

          {signatureFile && (
            <div className="p-2 rounded-lg bg-white bg-opacity-10">
              <p className="text-xs text-center text-white">
                Signature: {signatureFile.name}
              </p>
            </div>
          )}
        </div>

        <ErrorMessage message={error} className="w-full max-w-sm mt-4" />

        {isLoading ? (
          <LoadingSpinner message="Signing PDF..." className="mt-6" />
        ) : signedBlob ? (
          <SuccessMessage
            message="PDF signed successfully!"
            downloadLabel="Download Signed PDF"
            onDownload={handleDownload}
            onReset={() => {
              setFile(null);
              setSignatureFile(null);
              setSignatureBase64(null);
              setSignedBlob(null);
              setError(null);
            }}
            className="mt-6"
          />
        ) : (
          <Button
            onClick={handleSign}
            className="mt-6"
            disabled={!file || !signatureFile}
          >
            Sign PDF
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSign}
        title="Confirm Signature"
        message={`Add signature to "${file?.name}"?`}
        type="success"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="sign"
      />
    </>
  );
}

export default SignCard;
