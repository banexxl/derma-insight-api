import { requireUser } from "@/app/utils/auth/require-user";
import { err, json } from "@/app/utils/http/responses";
import { createSupabaseServiceClient } from "@/app/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
     try {
          const { userId } = await requireUser(req);
          const sb = createSupabaseServiceClient();

          const url = new URL(req.url);
          const limit = Math.min(Number(url.searchParams.get("limit") ?? 30), 100);
          const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

          const { data, error } = await sb
               .from("tblScans")
               .select("*")
               .eq("userId", userId)
               .order("createdAt", { ascending: false })
               .range(offset, offset + limit - 1);

          if (error) throw error;

          return json({ success: true, scans: data });
     } catch (e) {
          return err(e);
     }
}

export async function POST(req: NextRequest) {
     try {
          const { userId } = await requireUser(req);
          const body = await req.json().catch(() => ({}));

          const sb = createSupabaseServiceClient();

          const payload = {
               userId,
               status: body.status ?? "uploaded",
               bodyArea: body.bodyArea ?? null,
               symptoms: body.symptoms ?? null,
          };

          const { data, error } = await sb
               .from("tblScans")
               .insert(payload)
               .select("*")
               .single();

          if (error) throw error;

          return json({ success: true, scan: data }, { status: 201 });
     } catch (e) {
          return err(e);
     }
}
