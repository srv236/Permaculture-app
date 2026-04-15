import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  is_admin: boolean;
  is_verified: boolean;
  is_hidden?: boolean;
  picture_url?: string;
  phone?: string;
  alt_phone?: string;
  email?: string;
  about?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  website_url?: string;
  has_completed_basic?: boolean;
  has_completed_advanced?: boolean;
  basic_course_date?: string;
  advanced_course_date?: string;
}

export interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
