import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "list_conversations",
  title: "List conversations",
  description: "List the signed-in user's Affinity conversations with the other participant's public profile.",
  inputSchema: {
    limit: z.number().int().optional().describe("Maximum conversations to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    const { data: mine, error } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", userId);
    if (error) return textError(error.message);

    const ids = (mine ?? []).map((r) => r.conversation_id).slice(0, take);
    if (ids.length === 0) return jsonResult([]);

    const { data: others } = await supabase
      .from("conversation_participants")
      .select("conversation_id, user_id")
      .in("conversation_id", ids)
      .neq("user_id", userId);

    const otherIds = [...new Set((others ?? []).map((o) => o.user_id))];
    const { data: profiles } = await supabase.rpc("get_public_profiles", { _ids: otherIds });
    const byId = new Map(((profiles as { id: string }[] | null) ?? []).map((p) => [p.id, p]));

    return jsonResult(
      ids.map((id) => {
        const other = (others ?? []).find((o) => o.conversation_id === id);
        return {
          conversation_id: id,
          other_user_id: other?.user_id ?? null,
          other_profile: other ? byId.get(other.user_id) ?? null : null,
        };
      }),
    );
  },
});
