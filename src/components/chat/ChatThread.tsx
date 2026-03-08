import { useState, useRef, useEffect } from "react";
import type { Conversation, Message } from "@/pages/MessagesPage";
import AACToolbar from "@/components/chat/AACToolbar";
import VoiceNoteButton from "@/components/chat/VoiceNoteButton";
import { Send, Mic, Smile, MoreVertical, Phone, Video } from "lucide-react";

interface ChatThreadProps {
  conversation: Conversation;
}

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "them", type: "text", content: "Hey! I saw we have a 92% match 😊", time: "10:02 AM" },
    { id: "m2", sender: "me", type: "text", content: "Hi Sarah! Yes, that's amazing! I love that we both enjoy accessible hiking trails.", time: "10:05 AM" },
    { id: "m3", sender: "them", type: "text", content: "Right?! There's a great one near the park with paved paths. Want to check it out this weekend?", time: "10:07 AM" },
    { id: "m4", sender: "me", type: "voice", content: "Voice note", time: "10:10 AM", duration: 8 },
    { id: "m5", sender: "them", type: "text", content: "That sounds wonderful! 😊", time: "10:12 AM" },
  ],
  "2": [
    { id: "m1", sender: "me", type: "text", content: "Hey James! Love your profile", time: "9:30 AM" },
    { id: "m2", sender: "them", type: "voice", content: "Voice note", time: "9:45 AM", duration: 12 },
  ],
  "3": [
    { id: "m1", sender: "them", type: "aac", content: "👋 Hello! Nice to meet you", time: "Yesterday" },
    { id: "m2", sender: "me", type: "text", content: "Hi Maya! Great to connect with you too!", time: "Yesterday" },
    { id: "m3", sender: "them", type: "text", content: "See you Saturday!", time: "Yesterday" },
  ],
  "4": [
    { id: "m1", sender: "me", type: "text", content: "Your guide dog is so cute!", time: "2:00 PM" },
    { id: "m2", sender: "them", type: "text", content: "Thanks! His name is Buddy. He's the best companion.", time: "2:15 PM" },
    { id: "m3", sender: "me", type: "text", content: "I'd love to meet your guide dog!", time: "2:20 PM" },
  ],
};

const ChatThread = ({ conversation }: ChatThreadProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversation.id] || []);
  const [input, setInput] = useState("");
  const [showAAC, setShowAAC] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(mockMessages[conversation.id] || []);
    setInput("");
    setShowAAC(false);
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (content: string, type: "text" | "aac" = "text") => {
    if (!content.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "me",
      type,
      content: content.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const sendVoiceNote = (duration: number) => {
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "me",
      type: "voice",
      content: "Voice note",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      duration,
    };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <div className="relative">
          <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full object-cover border-2 border-border" />
          {conversation.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-sm truncate">{conversation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.online ? "Online" : "Offline"} · {conversation.compatibility}% Match
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Voice call">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Video call">
            <Video className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="More options">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* AAC toolbar */}
      {showAAC && (
        <AACToolbar onSelect={(phrase) => sendMessage(phrase, "aac")} />
      )}

      {/* Input bar */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAAC(!showAAC)}
            className={`p-2 rounded-full transition-colors ${showAAC ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
            aria-label="Toggle AAC tools"
            title="AAC Communication Tools"
          >
            <Smile className="w-5 h-5" />
          </button>

          <div className="flex-1 flex items-center bg-background border border-input rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Type a message..."
              className="bg-transparent text-sm flex-1 outline-none"
              aria-label="Message input"
            />
          </div>

          {input.trim() ? (
            <button
              onClick={() => sendMessage(input)}
              className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-warm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <VoiceNoteButton onSend={sendVoiceNote} />
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  const isMe = message.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card text-card-foreground shadow-card rounded-bl-md"
        }`}
      >
        {message.type === "voice" ? (
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 shrink-0" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-0.5 rounded-full ${isMe ? "bg-primary-foreground/60" : "bg-foreground/30"}`}
                  style={{ height: `${Math.random() * 16 + 4}px` }}
                />
              ))}
            </div>
            <span className="text-xs opacity-70">{message.duration}s</span>
          </div>
        ) : message.type === "aac" ? (
          <div>
            <span className="text-xs opacity-60 block mb-0.5">AAC</span>
            <span>{message.content}</span>
          </div>
        ) : (
          <span>{message.content}</span>
        )}
        <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {message.time}
        </p>
      </div>
    </div>
  );
};

export default ChatThread;
