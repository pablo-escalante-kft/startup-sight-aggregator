import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ChartBar, 
  Users, 
  Database, 
  Search,
  LogOut,
  RefreshCw,
  AlertCircle 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeStartup = async (startupId: string) => {
    setIsAnalyzing(true);
    try {
      const { error } = await supabase.functions.invoke('analyze-startup', {
        body: { startupId }
      });

      if (error) throw error;

      toast({
        title: "Analysis Started",
        description: "The AI analysis has been initiated. Check back soon for results.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to start analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark">
        <nav className="glass-panel m-4 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              DNV
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/startups" className="nav-link">Startups</Link>
            <Link to="/analysis" className="nav-link">Analysis</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="ml-4"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">
              VC Fund Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Active Startups"
                value="24"
                icon={<Users className="w-6 h-6" />}
              />
              <StatCard 
                title="Pending Analysis"
                value="8"
                icon={<Database className="w-6 h-6" />}
              />
              <StatCard 
                title="Total Investments"
                value="$12.4M"
                icon={<ChartBar className="w-6 h-6" />}
              />
              <StatCard 
                title="Potential Deals"
                value="15"
                icon={<Search className="w-6 h-6" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
                <div className="space-y-4">
                  {recentSubmissions.map((submission, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{submission.name}</h3>
                        <p className="text-sm text-gray-400">{submission.industry}</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleAnalyzeStartup(submission.id)}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <AlertCircle className="w-4 h-4 mr-2" />
                        )}
                        Analyze
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">AI Analysis Queue</h2>
                <div className="space-y-4">
                  {analysisQueue.map((analysis, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{analysis.name}</h3>
                        <p className="text-sm text-gray-400">{analysis.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card className="glass-panel p-6 animated-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-emerald-500">
        {icon}
      </div>
    </div>
  </Card>
);

const recentSubmissions = [
  { id: "1", name: "TechCorp AI", industry: "Artificial Intelligence" },
  { id: "2", name: "GreenEnergy Solutions", industry: "Clean Technology" },
  { id: "3", name: "HealthTech Innovations", industry: "Healthcare" },
];

const analysisQueue = [
  { name: "CloudScale Solutions", status: "Processing Data" },
  { name: "BioTech Research", status: "Analyzing Market Fit" },
  { name: "FinTech Revolution", status: "Generating Report" },
];

export default Index;
