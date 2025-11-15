"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  id: string;
}

export function FileUpload({
  onFilesChange,
  accept = "image/*",
  multiple = true,
  maxFiles = 5,
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }

      // Check max files limit
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setUploadedFiles((prev) => [...prev, uploadedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        newFiles.push(uploadedFile);
      }
    });

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  React.useEffect(() => {
    onFilesChange(uploadedFiles.map((f) => f.file));
  }, [uploadedFiles, onFilesChange]);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            {accept.includes("image") ? "Images" : "Files"} up to {maxSize}MB
            each. Maximum {maxFiles} files.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
              >
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : uploadedFile.file.type.startsWith("image/") ? (
                  <Image className="w-12 h-12 text-muted-foreground" />
                ) : (
                  <File className="w-12 h-12 text-muted-foreground" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadedFile.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
