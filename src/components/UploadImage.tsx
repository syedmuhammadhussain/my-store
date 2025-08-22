"use client";

import * as React from "react";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function UploadImages({
  value,
  onChange,
  maxFiles = 4,
  maxSizeMB = 5,
}: {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}) {
  const onFileReject = React.useCallback((file: File, message: string) => {
    // console.warn(`Rejected ${file.name}: ${message}`);
    toast.error(`Rejected ${file.name}: ${message}`, {
      className: "bg-card text-card-foreground border-border",
    });
  }, []);

  return (
    <FileUpload
      value={value}
      onValueChange={onChange}
      onFileReject={onFileReject}
      maxFiles={maxFiles}
      maxSize={maxSizeMB * 1024 * 1024}
      multiple
      className="w-full cursor-pointer"
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {maxFiles} files, up to {maxSizeMB} MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          {/* <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button> */}
        </FileUploadTrigger>
      </FileUploadDropzone>

      <FileUploadList>
        {value.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
