import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, requireAuth, supabaseForUser, textError } from "../supabase";

export default defineTool({
  name: "update_my_profile",
  title: "Update my profile",
  description: "Update fields on the signed-in user's Affinity profile. Only provided fields are changed.",
  inputSchema: {
    display_name: z.string().trim().optional().describe("Public display name."),
    bio: z.string().optional().describe("Short profile bio."),
    pronouns: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    interests: z.array(z.string()).optional().describe("List of interests."),
    accessibility_preferences: z.array(z.string()).optional().describe("Accessibility preferences."),
    communication_style: z.string().optional(),
    support_needs: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    const unauth = requireAuth(ctx);
    if (unauth) return unauth;

    const updates = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
    if (Object.keys(updates).length === 0) return textError("No fields provided to update.");

    const { data, error } = await supabaseForUser(ctx)
      .from("profiles")
      .update(updates)
      .eq("id", ctx.getUserId()!)
      .select()
      .maybeSingle();

    if (error) return textError(error.message);
    return jsonResult(data);
  },
});
