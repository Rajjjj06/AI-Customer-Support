import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileUpload({ upload, botId, loading }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedIds, setUploadedIds] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const fileRef = useRef(null);

  const acceptedTypes = [".pdf", ".docx", ".txt"];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      acceptedTypes.some((ext) => f.name.toLowerCase().endsWith(ext)),
    );
    addFiles(dropped);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    addFiles(selected);
    e.target.value = "";
  };

  const addFiles = (newFiles) => {
    const mapped = newFiles.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      size: f.size,
      type: f.name.split(".").pop().toUpperCase(),
      uploadedAt: new Date().toLocaleDateString(),
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setUploadedIds((prev) => prev.filter((fid) => fid !== id));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleUpload = async (fileObj) => {
    setUploadingId(fileObj.id);
    try {
      await upload(fileObj.file, botId);
      setUploadedIds((prev) => [...prev, fileObj.id]);
    } catch {
      // Optionally show error
    }
    setUploadingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleFileChange}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium">
          Drag & drop files here, or{" "}
          <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports PDF, DOCX, TXT files
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border bg-card p-3 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-50 sm:max-w-none">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file.type} · {formatSize(file.size)} · {file.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadedIds.includes(file.id) ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingId === file.id || loading}
                    onClick={() => handleUpload(file)}
                  >
                    {uploadingId === file.id ? "Uploading..." : "Upload"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
