
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StartupList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const { data: startups, isLoading } = useQuery({
    queryKey: ['startups', filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select(`
          *,
          startup_details(*),
          startup_financials(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Startups</h1>
          <Button onClick={() => navigate('/startups/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Startup
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </Card>
            ))
          ) : startups?.map((startup) => (
            <Card 
              key={startup.id} 
              className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => navigate(`/startups/${startup.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{startup.name}</h3>
                  <p className="text-gray-400 text-sm">{startup.industry}</p>
                </div>
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-4 text-sm">
                <p>Founded: {startup.founding_year}</p>
                <p>Location: {startup.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
};

export default StartupList;
