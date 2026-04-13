import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schema for User IDs (UUID format)
const UserIdSchema = z.string().uuid();

/**
 * Safely fetches a user profile by ID with input validation.
 * Uses Supabase's parameterized query engine to prevent SQL injection.
 */
export const getUserProfile = async (id: string) => {
  const validation = UserIdSchema.safeParse(id);
  
  if (!validation.success) {
    throw new Error("Invalid User ID format.");
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', validation.data)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Fetches all profiles (Admin only - RLS handles security)
 */
export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};