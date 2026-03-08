import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabilityType, setDisabilityType] = useState("Prefer not to say");
  const [commStyle, setCommStyle] = useState("Text");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, {
      display_name: name,
      disability_type: disabilityType,
      communication_style: commStyle.toLowerCase(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please check your email to confirm.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-heading text-2xl font-extrabold text-primary">TogetherAble</span>
            <Heart className="w-5 h-5 text-heart fill-heart" />
          </div>
          <p className="text-sm text-muted-foreground">Create your inclusive profile</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Enter your name" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Create a password (min 6 chars)" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Disability Type (Optional)</label>
            <select value={disabilityType} onChange={(e) => setDisabilityType(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-ring outline-none">
              <option>Prefer not to say</option>
              <option>Mobility Impairment</option>
              <option>Visual Impairment</option>
              <option>Hearing Impairment</option>
              <option>Neurodivergent</option>
              <option>Chronic Illness</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Communication</label>
            <select value={commStyle} onChange={(e) => setCommStyle(e.target.value)} className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-ring outline-none">
              <option>Text</option>
              <option>Voice</option>
              <option>Video</option>
              <option>AAC Tools</option>
            </select>
          </div>
          <Button variant="hero" className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
