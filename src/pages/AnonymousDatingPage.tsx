import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  useAnonymousProfile,
  useActiveMatch,
  useAnonMessages,
  sendAnonMessage,
  findMatch,
} from "@/hooks/useAnonymousDating";
import {
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Send,
  UserX,
  Image,
  UserCheck,
  Loader2,
  Lock,
  Heart,
  MessageCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const AnonymousDatingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) return <LoadingScreen />;
  if (!user) return <LoginPrompt onLogin={() => navigate("/login")} />;

  return <AnonymousDatingFlow />;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const LoginPrompt = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-card rounded-2xl shadow-card p-8 max-w-md text-center space-y-4">
      <Lock className="w-12 h-12 text-primary mx-auto" />
      <h2 className="font-heading text-2xl font-bold">Sign In Required</h2>
      <p className="text-muted-foreground">You need to be signed in to access Anonymous Smart Dating.</p>
      <Button variant="hero" size="lg" onClick={onLogin}>
        Sign In
      </Button>
    </div>
  </div>
);

const AnonymousDatingFlow = () => {
  const { nickname, loading: profileLoading, createProfile } = useAnonymousProfile();
  const { match, partnerNickname, loading: matchLoading, endMatch, updateRevealLevel, refetch } = useActiveMatch();
  const [step, setStep] = useState<"intro" | "nickname" | "matching" | "chat">("intro");
  const [finding, setFinding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (profileLoading || matchLoading) return;
    if (match) setStep("chat");
    else if (nickname) setStep("matching");
    else setStep("intro");
  }, [nickname, match, profileLoading, matchLoading]);

  const handleCreateProfile = async (nick: string) => {
    const result = await createProfile(nick);
    if (result?.error) {
      toast.error("Failed to create anonymous profile");
    }
  };

  const handleFindMatch = async () => {
    if (!user) return;
    setFinding(true);
    try {
      await findMatch(user.id);
      await refetch();
    } catch (e: any) {
      toast.error(e.message || "No match found");
    } finally {
      setFinding(false);
    }
  };

  const handleEndMatch = async () => {
    await endMatch();
    toast.success("Anonymous session ended");
  };

  if (profileLoading || matchLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen">
      {step === "intro" && (
        <IntroScreen onStart={() => setStep("nickname")} />
      )}
      {step === "nickname" && (
        <NicknameScreen onSubmit={handleCreateProfile} />
      )}
      {step === "matching" && (
        <MatchingScreen
          nickname={nickname!}
          finding={finding}
          onFind={handleFindMatch}
        />
      )}
      {step === "chat" && match && (
        <AnonymousChat
          match={match}
          partnerNickname={partnerNickname}
          myNickname={nickname!}
          onEnd={handleEndMatch}
          onReveal={updateRevealLevel}
        />
      )}
    </div>
  );
};

/* ─── Intro ─── */
const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="container max-w-2xl py-16 space-y-8 text-center">
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
        <Sparkles className="w-4 h-4" /> Premium Feature
      </div>
      <h1 className="font-heading text-4xl md:text-5xl font-extrabold">
        Anonymous <span className="text-gradient-primary">Smart Dating</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-lg mx-auto">
        Connect with someone compatible without revealing your identity. Let personality lead, not appearance.
      </p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4 text-left">
      {[
        { icon: Shield, title: "Privacy First", desc: "Your identity stays hidden until you choose to reveal it." },
        { icon: Zap, title: "AI Matching", desc: "Our AI analyzes compatibility based on interests & personality." },
        { icon: Heart, title: "Deep Connections", desc: "Focus on genuine conversation before appearance." },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className="bg-card rounded-xl p-5 shadow-card space-y-2">
          <Icon className="w-8 h-8 text-primary" />
          <h3 className="font-heading font-bold">{title}</h3>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-card rounded-2xl shadow-card p-6 max-w-md mx-auto space-y-4">
      <h3 className="font-heading font-bold text-lg">How It Works</h3>
      <div className="space-y-3 text-left">
        {[
          "Choose an anonymous nickname",
          "AI finds your most compatible match",
          "Chat anonymously in a private room",
          "Reveal your identity when you're ready",
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>

    <Button variant="hero" size="lg" onClick={onStart} className="text-lg px-10">
      Get Started — $3
    </Button>
    <p className="text-xs text-muted-foreground">One-time access fee. Your privacy is our priority.</p>
  </div>
);

/* ─── Nickname ─── */
const NicknameScreen = ({ onSubmit }: { onSubmit: (n: string) => void }) => {
  const [nick, setNick] = useState("");
  const suggestions = ["MoonWalker", "SilentPoet", "StarGazer", "DreamWeaver", "NightOwl", "WildSpirit"];

  return (
    <div className="container max-w-md py-16 space-y-6">
      <Progress value={33} className="h-2" />
      <div className="text-center space-y-2">
        <EyeOff className="w-10 h-10 text-primary mx-auto" />
        <h2 className="font-heading text-2xl font-bold">Choose Your Alias</h2>
        <p className="text-muted-foreground text-sm">
          Pick a fun anonymous nickname. Your real identity stays completely hidden.
        </p>
      </div>

      <Input
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        placeholder="Enter your nickname..."
        className="text-center text-lg font-heading"
        maxLength={20}
        aria-label="Anonymous nickname"
      />

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">Or pick a suggestion:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setNick(s + Math.floor(Math.random() * 99))}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        disabled={nick.trim().length < 3}
        onClick={() => onSubmit(nick.trim())}
      >
        Continue as "{nick || "..."}"
      </Button>
    </div>
  );
};

/* ─── Matching ─── */
const MatchingScreen = ({
  nickname,
  finding,
  onFind,
}: {
  nickname: string;
  finding: boolean;
  onFind: () => void;
}) => (
  <div className="container max-w-md py-16 space-y-6 text-center">
    <Progress value={66} className="h-2" />
    <div className="space-y-2">
      <Sparkles className="w-10 h-10 text-primary mx-auto" />
      <h2 className="font-heading text-2xl font-bold">Ready, {nickname}?</h2>
      <p className="text-muted-foreground text-sm">
        Our AI will analyze your profile and find the most compatible anonymous match for you.
      </p>
    </div>

    <div className="bg-card rounded-xl shadow-card p-5 space-y-3 text-left">
      <h4 className="font-heading font-semibold text-sm">AI analyzes:</h4>
      <div className="grid grid-cols-2 gap-2">
        {["Interests", "Communication Style", "Personality", "Lifestyle"].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            {item}
          </div>
        ))}
      </div>
    </div>

    <Button variant="hero" size="lg" className="w-full" onClick={onFind} disabled={finding}>
      {finding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Finding your match...
        </>
      ) : (
        <>
          <Zap className="w-4 h-4" /> Find My Match
        </>
      )}
    </Button>
  </div>
);

/* ─── Anonymous Chat ─── */
const AnonymousChat = ({
  match,
  partnerNickname,
  myNickname,
  onEnd,
  onReveal,
}: {
  match: any;
  partnerNickname: string;
  myNickname: string;
  onEnd: () => void;
  onReveal: (level: string) => void;
}) => {
  const { user } = useAuth();
  const { messages, loading } = useAnonMessages(match.id);
  const [input, setInput] = useState("");
  const [showRevealMenu, setShowRevealMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    await sendAnonMessage(match.id, user.id, input);
    setInput("");
  };

  const myRevealLevel =
    match.user1_id === user?.id ? match.user1_reveal_level : match.user2_reveal_level;
  const partnerRevealLevel =
    match.user1_id === user?.id ? match.user2_reveal_level : match.user1_reveal_level;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
          <EyeOff className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-sm truncate">{partnerNickname}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Compatibility: {match.compatibility_score}%
            </span>
            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${match.compatibility_score}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowRevealMenu(!showRevealMenu)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Reveal options"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={onEnd}
            className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            aria-label="End session"
          >
            <UserX className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Reveal menu */}
      {showRevealMenu && (
        <div className="border-b border-border bg-card/50 p-3 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Reveal your identity:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { level: "anonymous", label: "Stay Anonymous", icon: EyeOff },
              { level: "photo", label: "Share Photo", icon: Image },
              { level: "profile", label: "Share Profile", icon: UserCheck },
            ].map(({ level, label, icon: Icon }) => (
              <button
                key={level}
                onClick={() => { onReveal(level); setShowRevealMenu(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  myRevealLevel === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
          {partnerRevealLevel !== "anonymous" && (
            <p className="text-xs text-success">
              ✨ {partnerNickname} has shared their {partnerRevealLevel === "photo" ? "photo" : "profile"}!
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-semibold">
            <Shield className="w-3 h-3" /> Anonymous & Private
          </div>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            You're chatting anonymously as <strong>{myNickname}</strong> with <strong>{partnerNickname}</strong>.
            Compatibility: {match.compatibility_score}%
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No messages yet. Break the ice! 🎭
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-card-foreground shadow-card rounded-bl-md"
                  }`}
                >
                  <span>{msg.content}</span>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-background border border-input rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type anonymously..."
              className="bg-transparent text-sm flex-1 outline-none"
              aria-label="Anonymous message input"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-warm disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnonymousDatingPage;
