import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn('WARNING: SUPABASE_URL environment variable is missing or placeholder value is used.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.warn('WARNING: SUPABASE_ANON_KEY environment variable is missing or placeholder value is used.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

export default supabase;
