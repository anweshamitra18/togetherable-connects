import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/** Supabase client bound to the caller's verified token so RLS runs as that user. */
export function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function textError(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export function requireAuth(ctx: ToolContext) {
  return ctx.isAuthenticated() ? null : textError("Not authenticated");
}

export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
    structuredContent: { data } as Record<string, unknown>,
  };
}
