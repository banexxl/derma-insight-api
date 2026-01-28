import { requireUser } from "@/app/utils/auth/require-user";
import { err, json } from "@/app/utils/http/responses";
import { createSupabaseServiceClient } from "@/app/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
     try {
          const { userId, email } = await requireUser(req);
          const sb = createSupabaseServiceClient();

          // Does user exist?
          const { data: existing, error: fetchErr } = await sb
               .from('tblUsers')
               .select('userId, email, fullName, polarCustomerId')
               .eq('userId', userId)
               .maybeSingle();

          if (fetchErr) throw fetchErr;

          if (existing) {
               return json({ success: true, user: existing });
          }

          // Create minimal row. Polar fields can remain null until webhook sync.
          const { data: created, error: insErr } = await sb
               .from('tblUsers')
               .insert({
                    userId,
                    email: email ?? null,
                    // defaults from table handle the rest
               })
               .select('userId, email, fullName, polarCustomerId')
               .single();

          if (insErr) throw insErr;

          return json({ success: true, user: created }, { status: 201 });
     } catch (e) {
          return err(e);
     }
}
