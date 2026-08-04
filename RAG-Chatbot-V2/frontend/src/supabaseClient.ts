import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real Supabase credentials are configured
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20;

// Only create real client if credentials are valid
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock.supabase.co', 'mock-key-that-wont-be-used', {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

export type UserRole = 'student' | 'child' | 'professional';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  created_at: string;
}
