import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import updateMyProfile from "./tools/update-my-profile";
import listConversations from "./tools/list-conversations";
import listMessages from "./tools/list-messages";
import sendMessage from "./tools/send-message";
import browseProfiles from "./tools/browse-profiles";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "affinity-mcp",
  title: "Affinity",
  version: "0.1.0",
  instructions:
    "Tools for Affinity, an inclusive dating and community app. Use get_my_profile / update_my_profile for the signed-in member's profile, browse_profiles to discover members, and list_conversations, list_messages and send_message for chats. All tools act as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProfile, updateMyProfile, browseProfiles, listConversations, listMessages, sendMessage],
});
