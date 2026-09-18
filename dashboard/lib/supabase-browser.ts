import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let warned = false;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || key.startsWith("sb_secret_") || key.includes("service_role")) {
    if (!warned && process.env.NODE_ENV === "development") {
      console.warn("[thumba] Supabase Realtime is disabled until NEXT_PUBLIC_SUPABASE_ANON_KEY is configured with a public anon/publishable key.");
      warned = true;
    }
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, key, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  return browserClient;
}
