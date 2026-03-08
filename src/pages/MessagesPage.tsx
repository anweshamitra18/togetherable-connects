import { useState } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatThread from "@/components/chat/ChatThread";
import { ArrowLeft } from "lucide-react";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  compatibility: number;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  type: "text" | "voice" | "aac";
  content: string;
  time: string;
  duration?: number; // for voice notes in seconds
}

const MessagesPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Conversation list — hidden on mobile when chat is open */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-border bg-card shrink-0 ${selectedId ? "hidden md:block" : ""}`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Chat thread */}
      <div className={`flex-1 flex flex-col ${!selectedId ? "hidden md:flex" : "flex"}`}>
        {selected ? (
          <>
            {/* Mobile back button */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary border-b border-border"
              onClick={() => setSelectedId(null)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <ChatThread conversation={selected} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="font-heading text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

// --- Mock data ---
import profile1 from "@/assets/profile1.jpg";
import profile2 from "@/assets/profile2.jpg";
import profile3 from "@/assets/profile3.jpg";
import profile4 from "@/assets/profile4.jpg";

const conversations: Conversation[] = [
  { id: "1", name: "Sarah Mitchell", avatar: profile1, lastMessage: "That sounds wonderful! 😊", time: "2 min", unread: 2, online: true, compatibility: 92 },
  { id: "2", name: "James Rivera", avatar: profile2, lastMessage: "🎤 Voice note (0:12)", time: "15 min", unread: 0, online: true, compatibility: 87 },
  { id: "3", name: "Maya Johnson", avatar: profile3, lastMessage: "See you Saturday!", time: "1 hr", unread: 0, online: false, compatibility: 78 },
  { id: "4", name: "Alex Thompson", avatar: profile4, lastMessage: "I'd love to meet your guide dog!", time: "3 hr", unread: 1, online: false, compatibility: 95 },
];
