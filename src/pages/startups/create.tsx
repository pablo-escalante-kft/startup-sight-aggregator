
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StartupCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const { data, error } = await supabase
        .from('startups')
        .insert({
          name: formData.get('name'),
          industry: formData.get('industry'),
          location: formData.get('location'),
          founding_year: parseInt(formData.get('founding_year') as string),
          employee_count: parseInt(formData.get('employee_count') as string),
        })
        .select()
        .single();

      if (error) throw error;

      const { data: submissionUrl } = await supabase
        .rpc('generate_submission_url', { startup_id: data.id });

      toast({
        title: "Success!",
        description: "Startup created successfully. Share the submission link with the founders.",
      });

      navigate(`/startups/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark p-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-8">Create New Startup</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <Input 
                name="name" 
                required 
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Industry
              </label>
              <select 
                name="industry" 
                className="w-full p-2 rounded-md bg-background border border-input"
                required
              >
                <option value="fintech">Fintech</option>
                <option value="healthtech">Healthtech</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="ai_ml">AI/ML</option>
                <option value="cleantech">Cleantech</option>
                <option value="edtech">Edtech</option>
                <option value="enterprise">Enterprise</option>
                <option value="consumer">Consumer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <Input 
                name="location" 
                required 
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Founding Year
              </label>
              <Input 
                name="founding_year" 
                type="number" 
                required 
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Employees
              </label>
              <Input 
                name="employee_count" 
                type="number" 
                required 
                min="1"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/startups')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                Create Startup
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default StartupCreate;
