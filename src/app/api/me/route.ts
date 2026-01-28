import { requireUser } from "@/app/utils/auth/require-user";
import { err, json } from "@/app/utils/http/responses";
import { createSupabaseServiceClient } from "@/app/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
     try {
          const { userId } = await requireUser(req);
          const sb = createSupabaseServiceClient();

          const { data, error } = await sb
               .from("tblUsers")
               .select("*")
               .eq("userId", userId)
               .single();

          if (error) throw error;

          return json({ success: true, user: data });
     } catch (e) {
          return err(e);
     }
}
