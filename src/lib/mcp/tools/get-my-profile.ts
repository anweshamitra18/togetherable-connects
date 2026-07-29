import { defineTool } from "@lovable.dev/mcp-js";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Get my profile",
  description: "Get the signed-in user's Affinity profile, including bio, interests and accessibility preferences.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const { data, error } = await supabaseForUser(ctx)
      .from("profiles")
      .select("*")
      .eq("id", ctx.getUserId()!)
      .maybeSingle();

    if (error) return textError(error.message);
    if (!data) return textError("No profile found for this user yet.");
    return jsonResult(data);
  },
});
