"use client";
import React, { useRef } from "react";
import { IKUpload } from "imagekitio-next";
import { Folder, Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "video";
}


export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const ikUploadRefTest = useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
    return true; // Return true if the file passes validation
    return true; // Return true if the file passes validation
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgress = (evt:ProgressEvent) => {
    if(evt.lengthComputable&&onProgress){
        const percentComplete = (evt.loaded/evt.total)*100;
        onProgress(Math.round(percentComplete))
    }
  };

  const handleStartUpload = (evt: ProgressEvent) => {
    console.log("Start", evt);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("please upload a video ");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size should be less than 100MB");
        return false;
      }
    } else {
      const validateTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!validateTypes.includes(file.type)) {
        setError("Please upload a valid file (jpeg,jpg,PNG,Webp)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less then 5 MB");
        return false;
      }
    }
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        onError={onError}
        onSuccess={handleSuccess}
        // onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={fileType==="video"?"video/*":"image/*"}
        className="file-input file-input-bordered w-full"   
        // validateFile={validateFile}
        useUniqueFileName={true}
        folder={fileType==="video"?"/videos":"/images"}
      />
      {
        uploading&&(
            <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Uploading....</span>
            </div>
        )
      }{
        error&&(
            <div className="text-error text-sm ">
                {error}
            </div>
        )
      }
    </div>
  );
}
