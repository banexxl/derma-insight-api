import { createServerClient } from '@supabase/ssr';
import { createClient } from "@supabase/supabase-js";
import { cookies } from 'next/headers';

export const useServerSideSupabaseServiceRoleClient = async () => {
     // Use the server-side Supabase client
     const cookieStore = await cookies();
     const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SB_SERVICE_KEY!,
          {
               cookies: {
                    getAll: () => cookieStore.getAll(),
                    setAll: (cookiesToSet) => {
                         cookiesToSet.forEach(({ name, value, options }) => {
                              try {
                                   cookieStore.set(name, value, options);
                              } catch {
                                   // Handle cases where setting cookies in server actions isn't supported
                              }
                         });
                    },
               },
          }
     );

     return supabase
}

export function createSupabaseAnonClient() {
     return createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
               auth: { persistSession: false },
          }
     );
}

export function createSupabaseServiceClient() {
     return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SB_SERVICE_KEY!, {
          auth: { persistSession: false },
     });
}
