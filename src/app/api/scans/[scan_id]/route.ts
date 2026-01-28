import { requireUser } from "@/app/utils/auth/require-user";
import { err, json } from "@/app/utils/http/responses";
import { createSupabaseServiceClient } from "@/app/utils/supabase/server";
import { NextRequest } from "next/server";

type Params = { scanId: string };

export async function GET(req: NextRequest, ctx: { params: Promise<Params> }) {
     try {
          const { userId } = await requireUser(req);
          const { scanId } = await ctx.params;

          const sb = createSupabaseServiceClient();

          const { data, error } = await sb
               .from("tblScans")
               .select("*")
               .eq("scanId", scanId)
               .eq("userId", userId)
               .single();

          if (error) throw error;

          return json({ success: true, scan: data });
     } catch (e) {
          return err(e);
     }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<Params> }) {
     try {
          const { userId } = await requireUser(req);
          const { scanId } = await ctx.params;
          const body = await req.json().catch(() => ({}));

          const allowed = ["status", "bodyArea", "symptoms"] as const;
          const update: Record<string, any> = {};
          for (const k of allowed) if (k in body) update[k] = body[k];

          const sb = createSupabaseServiceClient();

          const { data, error } = await sb
               .from("tblScans")
               .update(update)
               .eq("scanId", scanId)
               .eq("userId", userId)
               .select("*")
               .single();

          if (error) throw error;

          return json({ success: true, scan: data });
     } catch (e) {
          return err(e);
     }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<Params> }) {
     try {
          const { userId } = await requireUser(req);
          const { scanId } = await ctx.params;

          const sb = createSupabaseServiceClient();

          const { error } = await sb
               .from("tblScans")
               .delete()
               .eq("scanId", scanId)
               .eq("userId", userId);

          if (error) throw error;

          return json({ success: true });
     } catch (e) {
          return err(e);
     }
}
