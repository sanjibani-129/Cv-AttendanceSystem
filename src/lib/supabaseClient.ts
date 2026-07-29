import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Thrown at build/runtime so a missing .env.local is obvious immediately
  // instead of failing silently deep inside a fetch call.
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars are missing. Copy .env.local.example to .env.local and fill in your project keys."
  );
}

// Client-side reads (e.g. loading descriptors for the live scanner) go
// through this. It only ever uses the anon key, never the service role key.
export const supabaseBrowser = createClient(url, anonKey);
