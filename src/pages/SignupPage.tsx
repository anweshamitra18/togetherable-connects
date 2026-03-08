import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const SignupPage = () => (
  <div className="min-h-screen flex items-center justify-center py-10">
    <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-heading text-2xl font-extrabold text-primary">TogetherAble</span>
          <Heart className="w-5 h-5 text-heart fill-heart" />
        </div>
        <p className="text-sm text-muted-foreground">Create your inclusive profile</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Enter your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Create a password" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Disability Type (Optional)</label>
          <select className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-ring outline-none">
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
          <select className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm appearance-none focus:ring-2 focus:ring-ring outline-none">
            <option>Text</option>
            <option>Voice</option>
            <option>Video</option>
            <option>AAC Tools</option>
          </select>
        </div>
        <Button variant="hero" className="w-full" size="lg" type="submit">
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
      </p>
    </div>
  </div>
);

export default SignupPage;
