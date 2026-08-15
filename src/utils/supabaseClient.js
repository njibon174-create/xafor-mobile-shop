import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing from .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
  return data;
}
