import {
  createClient,
  SupabaseClientOptions,
} from "@supabase/supabase-js";
import {Database} from "@/lib/schema";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL as
  | string
  | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

const options = {
  db: {
    schema: "public" as const,
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
} as SupabaseClientOptions<"public">;

if (!projectUrl) {
  throw new Error(
      "NEXT_PUBLIC_SUPABASE_AUTH_URL is not defined as an environment variable",
  );
}

if (!anonKey) {
  throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined as an environment variable",
  );
}

export const supabaseConfig = {
  supabaseUrl: projectUrl,
  supabaseKey: anonKey,
  supabaseOptions: options
}

/** The client used in client side react components */
export const supabaseClient = createClient<Database>(projectUrl, anonKey, options);