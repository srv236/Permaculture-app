"use client";

import { useState, useEffect } from "react";
import { getSignedUrl } from "@/utils/upload";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface SecureImageProps {
  path?: string;
  bucket: "produce_images" | "profile_pictures" | "assets";
  alt: string;
  className?: string;
  fallback?: string;
}

export const SecureImage = ({ path, bucket, alt, className, fallback }: SecureImageProps) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = async () => {
      if (!path) {
        setUrl(fallback || "");
        setLoading(false);
        return;
      }

      if (path.startsWith('http')) {
        setUrl(path);
        setLoading(false);
        return;
      }

      setLoading(true);
      const signedUrl = await getSignedUrl(bucket, path);
      setUrl(signedUrl || fallback || "");
      setLoading(false);
    };

    fetchUrl();
  }, [path, bucket, fallback]);

  if (loading) {
    return <Skeleton className={cn("w-full h-full", className)} />;
  }

  return (
    <img 
      src={url || fallback} 
      alt={alt} 
      className={cn("object-cover", className)} 
    />
  );
};