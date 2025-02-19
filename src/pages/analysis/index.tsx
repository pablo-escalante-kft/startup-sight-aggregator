
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const AnalysisDashboard = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select(`
          *,
          startups (
            name,
            industry
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const industryData = analyses?.reduce((acc: any[], analysis) => {
    const industry = analysis.startups?.industry;
    const existing = acc.find(item => item.name === industry);
    if (existing) {
      existing.value++;
    } else if (industry) {
      acc.push({ name: industry, value: 1 });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark p-8">
        <h1 className="text-3xl font-bold mb-8">Analysis Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Industry Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
            <div className="space-y-4">
              {analyses?.slice(0, 5).map((analysis) => (
                <div 
                  key={analysis.id}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{analysis.startups?.name}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{analysis.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AnalysisDashboard;
