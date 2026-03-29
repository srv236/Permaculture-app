import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, bucket: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // Return the path so SecureImage can handle generating the correct URL
  return filePath;
};

export const getSignedUrl = async (bucket: string, path: string) => {
  if (!path) return "";
  
  // If it's already a full URL (like a mock image), return it as is
  if (path.startsWith('http')) return path;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // URL valid for 1 hour

  if (error) {
    console.error("Error generating signed URL:", error);
    // Fallback to public URL if signed URL fails (in case bucket is public)
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicData.publicUrl;
  }

  return data.signedUrl;
};