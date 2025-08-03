import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.EXPRESS_APP_SUPABASE_URL!;
const SUPABASE_KEY = process.env.EXPRESS_APP_SUPABASE_KEY!;

/**
 * Supabase client for server-side operations
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
