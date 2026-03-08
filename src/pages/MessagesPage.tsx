import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useMessaging";
import ConversationList from "@/components/chat/ConversationList";
import ChatThread from "@/components/chat/ChatThread";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("conv"));
  const { conversations, loading, refetch } = useConversations();

  useEffect(() => {
    const conv = searchParams.get("conv");
    if (conv) setSelectedId(conv);
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-heading text-lg">Please log in to view your messages</p>
          <Button variant="hero" asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className={`w-full md:w-80 lg:w-96 border-r border-border bg-card shrink-0 ${selectedId ? "hidden md:block" : ""}`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
        />
      </div>

      <div className={`flex-1 flex flex-col ${!selectedId ? "hidden md:flex" : "flex"}`}>
        {selected ? (
          <>
            <button
              className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary border-b border-border"
              onClick={() => setSelectedId(null)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <ChatThread
              conversationId={selected.id}
              otherName={selected.name}
              otherAvatar={selected.avatar}
              onMessageSent={refetch}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="font-heading text-lg">
              {conversations.length === 0 && !loading
                ? "No conversations yet. Start matching to chat!"
                : "Select a conversation to start chatting"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
