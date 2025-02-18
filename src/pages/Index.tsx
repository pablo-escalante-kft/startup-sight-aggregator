
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartBar, 
  Users, 
  Database, 
  Search 
} from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <nav className="glass-panel m-4 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            DNV
          </span>
        </div>
        <div className="flex space-x-4">
          <button className="nav-link">Dashboard</button>
          <button className="nav-link">Startups</button>
          <button className="nav-link">Analysis</button>
          <button className="nav-link">Settings</button>
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
                    <Button variant="outline">View Details</Button>
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

// Dummy data
const recentSubmissions = [
  { name: "TechCorp AI", industry: "Artificial Intelligence" },
  { name: "GreenEnergy Solutions", industry: "Clean Technology" },
  { name: "HealthTech Innovations", industry: "Healthcare" },
];

const analysisQueue = [
  { name: "CloudScale Solutions", status: "Processing Data" },
  { name: "BioTech Research", status: "Analyzing Market Fit" },
  { name: "FinTech Revolution", status: "Generating Report" },
];

export default Index;
