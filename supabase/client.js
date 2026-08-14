import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://wmeyniqazudlbhmcnlet.supabase.co";

// MASUKKAN PUBLISHABLE KEY KAMU DI SINI
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BCDzJa9TD2AJVioZEV3Eqw_WhAvaApn";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
