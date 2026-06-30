import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { Task } from "../types";

interface DropzoneProps {
  onIngestSuccess: (task: Task) => void;
}

export default function Dropzone({ onIngestSuccess }: DropzoneProps) {
  const [textInput, setTextInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a screenshot image file (PNG, JPEG, etc.).");
      return;
    }
    setErrorMsg(null);
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      setImageBase64(base64String);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleIngest = async () => {
    if (!textInput.trim() && !imageBase64) {
      setErrorMsg("Please paste a notice text or drag in a screenshot to proceed.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          imageBase64,
          mimeType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse and extract information. Check backend logs.");
      }

      const data = await response.json();
      if (data.success && data.task) {
        onIngestSuccess(data.task);
        // Reset Ingestion Hub
        setTextInput("");
        setImageBase64(null);
        setMimeType(null);
        setSelectedFileName(null);
      } else {
        throw new Error("Invalid response format received from extraction server.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during extraction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="ingestion-hub-step" className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#475569]" />
        <h3 className="text-lg font-display font-semibold text-[#0f172a]">
          Multimodal Data Ingestion Hub
        </h3>
      </div>
      <p className="text-sm text-[#64748b] mb-4">
        Paste chat notifications, placement updates, or upload screenshots from emails or notices.
        Kairos AI extracts and timetables them automatically.
      </p>

      {/* Raw Text Input */}
      <div className="mb-4">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#64748b] mb-1.5">
          Paste Raw Announcement/Notice Text
        </label>
        <textarea
          rows={4}
          value={textInput}
          onChange={handleTextChange}
          placeholder="e.g., 'Amazon Online Assessment is scheduled. Complete the test by July 4, 2026. Here is the link: https://amazon-recruiting.com/oa'"
          className="w-full text-sm p-3 border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#475569] font-sans text-[#334155]"
        />
      </div>

      {/* Drag & Drop File Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#475569] bg-[#f8fafc]"
            : "border-[#e2e8f0] hover:border-[#cbd5e1]"
        }`}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="w-8 h-8 text-[#94a3b8] mb-2" />
        <span className="text-sm font-medium text-[#475569] text-center">
          {selectedFileName ? (
            <span className="text-[#0f172a] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> {selectedFileName}
            </span>
          ) : (
            "Drag & Drop Screenshot or Click to Browse"
          )}
        </span>
        <span className="text-xs text-[#94a3b8] mt-1">Supports PNG, JPEG, WEBP, etc.</span>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
          {errorMsg}
        </div>
      )}

      <div className="mt-auto pt-6 flex gap-3">
        {selectedFileName && (
          <button
            onClick={() => {
              setImageBase64(null);
              setMimeType(null);
              setSelectedFileName(null);
            }}
            className="px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
          >
            Clear Upload
          </button>
        )}
        <button
          onClick={handleIngest}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-[#0f172a] text-white font-medium rounded-lg text-sm hover:bg-[#1e293b] active:bg-[#0f172a] disabled:bg-[#94a3b8] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Kairos Extracting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze &amp; Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
}
