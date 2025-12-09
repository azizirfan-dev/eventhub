"use client";

import { useState } from "react";

export function useCloudinaryUpload() {
  const [isUploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      form.append("folder", "eventhub"); // optional but recommended

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary API error:", errorText);
        throw new Error("Upload failed");
      }

      const data = await res.json();
      return data.secure_url as string;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
}
