
import { useParams } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StartupDetail = () => {
  const { id } = useParams();

  const { data: startup, isLoading } = useQuery({
    queryKey: ['startup', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select(`
          *,
          startup_details(*),
          startup_financials(*),
          ai_analyses(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{startup?.name}</h1>
          <p className="text-gray-400">{startup?.industry} • Founded {startup?.founding_year}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { month: 'Jan', revenue: 30000 },
                { month: 'Feb', revenue: 45000 },
                { month: 'Mar', revenue: 42000 },
                { month: 'Apr', revenue: 55000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <div className="space-y-4">
              {startup?.ai_analyses?.map((analysis) => (
                <div key={analysis.id} className="border-b border-gray-700 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                      {analysis.status}
                    </span>
                  </div>
                  <p className="text-sm">{analysis.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default StartupDetail;
