import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "browse_profiles",
  title: "Browse member profiles",
  description: "Browse public Affinity member profiles to discover potential matches. Returns only public fields.",
  inputSchema: {
    limit: z.number().int().optional().describe("Maximum profiles to return (default 10, max 30)."),
    interest: z.string().optional().describe("Optional interest keyword to filter on."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, interest }, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;
    const take = Math.min(Math.max(limit ?? 10, 1), 30);

    let query = supabaseForUser(ctx)
      .from("profiles")
      .select("id, display_name, bio, pronouns, location, country, interests, accessibility_preferences, avatar_url")
      .neq("id", ctx.getUserId()!)
      .limit(take);

    if (interest) query = query.contains("interests", [interest]);

    const { data, error } = await query;
    if (error) return textError(error.message);
    return jsonResult(data ?? []);
  },
});
