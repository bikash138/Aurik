"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Cropper, { Point, Area } from "react-easy-crop";
import { Camera, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/crop-image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null; // Existing remote URL
  onBlobChange?: (blob: Blob | null) => void; // Notify parent of new local image
  aspectRatio?: number;
  shape?: "round" | "rect";
  className?: string;
  imageClassName?: string;
  fallback?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export function ImageUpload({
  value,
  onBlobChange,
  aspectRatio = 1,
  shape = "round",
  className,
  imageClassName,
  fallback,
  disabled,
  loading,
}: ImageUploadProps) {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && localPreviewUrl) {
      setLocalPreviewUrl(null);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(blob);

      setLocalPreviewUrl(previewUrl);
      onBlobChange?.(blob);
      setImageToCrop(null);
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to process image");
    }
  };

  const currentImageUrl = localPreviewUrl || value;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
      />
      <div className="relative group">
        <div
          className={cn(
            "relative overflow-hidden bg-secondary border border-border flex items-center justify-center shrink-0",
            shape === "round" ? "rounded-full" : "rounded-xl",
            imageClassName,
          )}
        >
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={!!localPreviewUrl}
            />
          ) : (
            fallback || <Upload className="h-6 w-6 text-muted-foreground" />
          )}

          {loading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading}
          className={cn(
            "absolute bottom-0 right-0 w-8 h-8 rounded-full bg-(--color-brand) text-(--color-lime) ring-2 ring-(--color-page-bg-deep) shadow-md flex items-center justify-center hover:scale-105 transition-transform translate-x-1/4 translate-y-1/4",
          )}
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {imageToCrop && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-heading">Crop Image</h3>
              <p className="text-xs text-muted">Adjust your image to fit the area</p>
            </div>
            
            <div className="relative flex-1 bg-black/5">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={shape === "round" ? "round" : "rect"}
                onCropChange={setCrop}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 flex gap-3 justify-end bg-background border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setImageToCrop(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                  type="button" 
                  onClick={handleCropDone}
                  disabled={loading}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
