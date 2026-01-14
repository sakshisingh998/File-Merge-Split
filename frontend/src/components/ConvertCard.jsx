// src/components/ConvertCard.jsx
import React, { useState } from "react";
import { Image, HelpCircle, Download, Loader2 } from "lucide-react";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import HelpModal from "./HelpModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import FileInput from "./FileInput";
import FileList from "./FileList";
import { pdfToImage, imageToPdf, downloadBlob } from "../api/api";
import theme from "../config/theme";

function ConvertCard() {
  const [operation, setOperation] = useState("pdf-to-image");
  const [file, setFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [format, setFormat] = useState("PNG");
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

  const handleImageFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    setResultBlob(null);
  };

  const removeImageFile = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setError(null);
  };

  const handleConvert = () => {
    if (operation === "pdf-to-image" && !file) {
      alert("Please select a PDF file");
      return;
    }
    if (operation === "image-to-pdf" && imageFiles.length === 0) {
      alert("Please select at least one image file");
      return;
    }
    setShowConfirm(true);
  };

  const confirmConvert = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setResultBlob(null);

    try {
      if (operation === "pdf-to-image") {
        const blob = await pdfToImage(file, format);
        setResultBlob(blob);
      } else {
        const blob = await imageToPdf(imageFiles);
        setResultBlob(blob);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to convert. Please try again.`);
      console.error("Convert error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      const fileName = operation === "pdf-to-image" 
        ? `pdf_to_${format.toLowerCase()}.zip`
        : "images_to_pdf.pdf";
      downloadBlob(resultBlob, fileName);
    }
  };

  return (
    <>
      <div
        className="p-8 rounded-2xl shadow-2xl flex flex-col items-center min-h-[400px] justify-between
                   transition-all duration-500 transform hover:scale-102 relative"
        style={{
          backgroundImage: theme.colors.card.extract,
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
          <Image size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Convert</h2>
          <p className="opacity-80 text-sm">Convert between PDF and image formats seamlessly.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setOperation("pdf-to-image");
                setFile(null);
                setResultBlob(null);
                setError(null);
              }}
              variant={operation === "pdf-to-image" ? "default" : "secondary"}
              className="flex-1 text-sm"
            >
              PDF to Image
            </Button>
            <Button
              onClick={() => {
                setOperation("image-to-pdf");
                setImageFiles([]);
                setResultBlob(null);
                setError(null);
              }}
              variant={operation === "image-to-pdf" ? "default" : "secondary"}
              className="flex-1 text-sm"
            >
              Image to PDF
            </Button>
          </div>

          {operation === "pdf-to-image" ? (
            <>
              <FileInput
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-3 rounded-lg text-center border-2 transition-all duration-200
                           focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                style={{
                  backgroundColor: theme.colors.button.bg,
                  color: theme.colors.button.text,
                  borderColor: theme.colors.background,
                }}
              >
                <option value="PNG">PNG</option>
                <option value="JPEG">JPEG</option>
              </select>
            </>
          ) : (
            <>
              <FileInput
                accept="image/*"
                multiple
                onChange={handleImageFiles}
              />
              <FileList files={imageFiles} onRemove={removeImageFile} />
            </>
          )}
        </div>

        <ErrorMessage message={error} className="w-full max-w-sm mt-4" />

        {isLoading ? (
          <LoadingSpinner message="Converting..." className="mt-6" />
        ) : resultBlob ? (
          <SuccessMessage
            message="Conversion successful!"
            downloadLabel={`Download ${operation === "pdf-to-image" ? "Images (ZIP)" : "PDF"}`}
            onDownload={handleDownload}
            onReset={() => {
              setFile(null);
              setImageFiles([]);
              setResultBlob(null);
              setError(null);
            }}
            className="mt-6"
          />
        ) : (
          <Button
            onClick={handleConvert}
            className="mt-6"
            disabled={(operation === "pdf-to-image" && !file) || (operation === "image-to-pdf" && imageFiles.length === 0)}
          >
            Convert
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmConvert}
        title="Confirm Conversion"
        message={operation === "pdf-to-image" 
          ? `Convert "${file?.name}" to ${format} images?`
          : `Convert ${imageFiles.length} image(s) to PDF?`}
        type="success"
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        cardType="convert"
      />
    </>
  );
}

export default ConvertCard;
