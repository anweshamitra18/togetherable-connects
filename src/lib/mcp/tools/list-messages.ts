import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "list_messages",
  title: "List messages",
  description: "Read recent messages in one of the signed-in user's Affinity conversations, oldest first.",
  inputSchema: {
    conversation_id: z.string().describe("The conversation UUID, from list_conversations."),
    limit: z.number().int().optional().describe("Maximum messages to return (default 30, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ conversation_id, limit }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;
    const take = Math.min(Math.max(limit ?? 30, 1), 100);

    const { data, error } = await supabaseForUser(ctx)
      .from("messages")
      .select("id, conversation_id, sender_id, type, content, duration, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false })
      .limit(take);

    if (error) return textError(error.message);
    return jsonResult((data ?? []).reverse());
  },
});
