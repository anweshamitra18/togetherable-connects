import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center py-10">
    <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-heading text-2xl font-extrabold text-primary">TogetherAble</span>
          <Heart className="w-5 h-5 text-heart fill-heart" />
        </div>
        <p className="text-sm text-muted-foreground">Welcome back!</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Enter your password" />
        </div>
        <Button variant="hero" className="w-full" size="lg" type="submit">
          Log In
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  </div>
);

export default LoginPage;
