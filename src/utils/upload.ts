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

  return filePath;
};

export const getPublicUrl = (bucket: string, path: string) => {
  if (!path) return "";
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const getSignedUrl = async (bucket: string, path: string) => {
  if (!path) return "";
  
  if (path.startsWith('http') || path.startsWith('dyad-media')) return path;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);

    if (error) {
      // Fallback to public URL if signed URL fails
      return getPublicUrl(bucket, path);
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Error in getSignedUrl:", err);
    return getPublicUrl(bucket, path);
  }
};