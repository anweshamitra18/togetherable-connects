import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "send_message",
  title: "Send message",
  description: "Send a text message as the signed-in user in one of their Affinity conversations.",
  inputSchema: {
    conversation_id: z.string().describe("The conversation UUID, from list_conversations."),
    content: z.string().trim().min(1).describe("Message text to send."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ conversation_id, content }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const { data, error } = await supabaseForUser(ctx)
      .from("messages")
      .insert({ conversation_id, sender_id: ctx.getUserId()!, content, type: "text" })
      .select()
      .maybeSingle();

    if (error) return textError(error.message);
    return jsonResult(data);
  },
});
