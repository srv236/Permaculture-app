"use client";

import { useState, useEffect } from "react";
import { getSignedUrl, getPublicUrl } from "@/api/upload";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface SecureImageProps {
  path?: string | null;
  bucket: "produce_images" | "profile_pictures" | "assets";
  alt: string;
  className?: string;
  fallback?: string;
}

export const SecureImage = ({ path, bucket, alt, className, fallback }: SecureImageProps) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      setError(false);
      
      if (!path) {
        setUrl(fallback || "");
        setLoading(false);
        return;
      }

      if (path.startsWith('http') || path.startsWith('dyad-media')) {
        setUrl(path);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        if (bucket === 'assets') {
          const publicUrl = getPublicUrl(bucket, path);
          setUrl(publicUrl || fallback || "");
        } else {
          const signedUrl = await getSignedUrl(bucket, path);
          setUrl(signedUrl || fallback || "");
        }
      } catch (err) {
        console.error("Error fetching image URL:", err);
        setUrl(fallback || "");
      }
      
      setLoading(false);
    };

    fetchUrl();
  }, [path, bucket, fallback]);

  if (loading) {
    return <Skeleton className={cn("w-full h-full", className)} />;
  }

  // If we have no URL and no fallback, show the text placeholder
  if ((!url && !fallback) || error) {
    const placeholderText = bucket === 'profile_pictures' ? 'Practitioner' : bucket === 'produce_images' ? 'Produce' : 'Image';
    return <ImagePlaceholder text={placeholderText} className={className} />;
  }

  return (
    <img 
      src={url || fallback} 
      alt={alt} 
      className={cn("object-cover", className)}
      onError={() => {
        if (fallback && url !== fallback) {
          setUrl(fallback);
        } else {
          setError(true);
        }
      }}
    />
  );
};