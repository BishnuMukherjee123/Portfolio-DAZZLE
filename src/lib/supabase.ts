import { createClient } from "@supabase/supabase-js";

// Get Supabase configuration from environment variables
const supabaseUrl = (
  import.meta as unknown as { env: { VITE_SUPABASE_URL?: string } }
).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (
  import.meta as unknown as { env: { VITE_SUPABASE_ANON_KEY?: string } }
).env.VITE_SUPABASE_ANON_KEY;

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file"
  );
}

// Create Supabase client only if we have valid credentials
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Type definitions for the contact_messages table
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const insertContactMessage = async (
  message: Omit<ContactMessage, "id" | "created_at">
) => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set up your environment variables."
    );
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert([message])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
