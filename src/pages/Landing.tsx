
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    company: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using raw query to bypass TypeScript issues since the table was just created
      const { error } = await supabase.rpc('add_to_waitlist', {
        p_email: formData.email,
        p_full_name: formData.fullName,
        p_company: formData.company
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });

      setFormData({ email: "", fullName: "", company: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message === "duplicate key value violates unique constraint \"waitlist_email_key\""
          ? "This email is already on our waitlist!"
          : "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            DNV VC Fund AI Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Revolutionizing startup evaluation through AI-powered analysis
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Join Our Waitlist</h2>
            <p className="text-gray-300">
              Get early access to our AI-powered platform that streamlines startup evaluation
              through advanced analysis and interactive dashboards.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                AI-Driven Analysis
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Interactive Dashboards
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                Comprehensive Startup Evaluation
              </li>
            </ul>
          </div>

          <Card className="glass-panel p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  placeholder="Acme Inc"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
