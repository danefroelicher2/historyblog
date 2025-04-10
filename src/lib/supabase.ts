// src/lib/supabase.ts
"use client";

import { createClient } from "@supabase/supabase-js";
// Use type definition without path alias to avoid import errors
import type { Database } from "../types/supabase";

// These environment variables need to be defined in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log an error if environment variables are missing, but don't throw
// This allows the app to still function and show appropriate error messages
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder-url.supabase.co", // Fallback to prevent runtime errors
  supabaseKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "history-blog-auth-storage", // Add a specific storage key
    },
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseKey;
};
