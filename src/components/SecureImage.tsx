"use client";

import { useState, useEffect } from "react";
import { getSignedUrl, getPublicUrl } from "@/utils/upload";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface SecureImageProps {
  path?: string;
  bucket: "produce_images" | "profile_pictures" | "assets";
  alt: string;
  className?: string;
  fallback?: string;
  coordinates?: { lat?: number; lng?: number };
}

export const SecureImage = ({ path, bucket, alt, className, fallback, coordinates }: SecureImageProps) => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      setError(false);
      
      // If no path but we have coordinates, use Google Static Maps
      if (!path && coordinates?.lat && coordinates?.lng) {
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=400x400&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=YOUR_API_KEY_HERE`;
        setUrl(mapUrl);
        setLoading(false);
        return;
      }

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
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [path, bucket, fallback, coordinates]);

  if (loading) {
    return <Skeleton className={cn("w-full h-full rounded-xl", className)} />;
  }

  if (error || (!url && !fallback)) {
    return (
      <div className={cn("w-full h-full bg-slate-100 flex items-center justify-center text-slate-400", className)}>
        <MapPin className="w-8 h-8 opacity-20" />
      </div>
    );
  }

  return (
    <img 
      src={url || fallback} 
      alt={alt} 
      className={cn("object-cover", className)}
      onError={() => {
        if (url !== fallback) {
          setUrl(fallback || "");
        } else {
          setError(true);
        }
      }}
    />
  );
};