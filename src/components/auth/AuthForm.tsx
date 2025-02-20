
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AuthMode = "signin" | "signup";

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'fund_manager' // Default role for now
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Please check your email to verify your account."
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "Successfully signed in."
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel w-full max-w-md p-6 animate-fade-in">
      <form onSubmit={handleAuth} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h2>

        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 rounded-md bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-400">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="ml-2 text-primary hover:underline"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </Card>
  );
};
