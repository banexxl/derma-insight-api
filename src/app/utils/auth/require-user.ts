import { NextRequest } from "next/server";
import { createSupabaseAnonClient } from "../supabase/server";

export type AuthedUser = { userId: string; email?: string | null };

export async function requireUser(req: NextRequest): Promise<AuthedUser> {
     const auth = req.headers.get("authorization") || "";
     const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;

     if (!token) {
          throw Object.assign(new Error("Missing Authorization Bearer token"), { status: 401 });
     }

     const supabase = createSupabaseAnonClient();
     const { data, error } = await supabase.auth.getUser(token);

     if (error || !data?.user) {
          throw Object.assign(new Error("Invalid or expired token"), { status: 401 });
     }

     return { userId: data.user.id, email: data.user.email };
}
