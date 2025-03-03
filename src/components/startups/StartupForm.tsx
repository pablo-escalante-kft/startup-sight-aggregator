
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type IndustryType = Database["public"]["Enums"]["industry_type"];

export const StartupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Company Information
    name: "",
    industry: "" as IndustryType,
    foundingYear: "",
    location: "",
    employeeCount: "",
    
    // Business Details
    problemStatement: "",
    solution: "",
    businessModel: "",
    revenueModel: "",
    marketSize: "",
    targetMarket: "",
    competitiveAdvantage: "",
    productStage: "",
    techStack: "",
    ipPatents: "",
    
    // Financials
    currentRevenue: "",
    burnRate: "",
    runwayMonths: "",
    fundingRaised: "",
    valuation: "",
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: "", role: "", experience: "", linkedinUrl: "" }
  ]);

  const [files, setFiles] = useState({
    pitchDeck: null as File | null,
    financialStatements: null as File | null,
    businessPlan: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as IndustryType }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleAddTeamMember = () => {
    setTeamMembers(prev => [
      ...prev,
      { name: "", role: "", experience: "", linkedinUrl: "" }
    ]);
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert startup basic info
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .insert({
          name: formData.name,
          industry: formData.industry,
          founding_year: parseInt(formData.foundingYear),
          location: formData.location,
          employee_count: parseInt(formData.employeeCount),
        })
        .select()
        .single();

      if (startupError) throw startupError;

      // Insert startup details
      const { error: detailsError } = await supabase
        .from('startup_details')
        .insert({
          startup_id: startup.id,
          problem_statement: formData.problemStatement,
          solution: formData.solution,
          business_model: formData.businessModel,
          revenue_model: formData.revenueModel,
          market_size: formData.marketSize,
          target_market: formData.targetMarket,
          competitive_advantage: formData.competitiveAdvantage,
          product_stage: formData.productStage,
          tech_stack: formData.techStack,
          ip_patents: formData.ipPatents,
        });

      if (detailsError) throw detailsError;

      // Insert financials
      const { error: financialsError } = await supabase
        .from('startup_financials')
        .insert({
          startup_id: startup.id,
          current_revenue: formData.currentRevenue ? parseFloat(formData.currentRevenue) : null,
          burn_rate: formData.burnRate ? parseFloat(formData.burnRate) : null,
          runway_months: formData.runwayMonths ? parseInt(formData.runwayMonths) : null,
          funding_raised: formData.fundingRaised ? parseFloat(formData.fundingRaised) : null,
          valuation: formData.valuation ? parseFloat(formData.valuation) : null,
        });

      if (financialsError) throw financialsError;

      // Insert team members
      const { error: teamError } = await supabase
        .from('team_members')
        .insert(
          teamMembers.map(member => ({
            startup_id: startup.id,
            name: member.name,
            role: member.role,
            experience: member.experience,
            linkedin_url: member.linkedinUrl,
          }))
        );

      if (teamError) throw teamError;

      // Handle file uploads
      for (const [type, file] of Object.entries(files)) {
        if (file) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('startup-documents')
            .upload(`${startup.id}/${type}`, file);

          if (uploadError) throw uploadError;

          // Create document record
          const { error: documentError } = await supabase
            .from('documents')
            .insert({
              startup_id: startup.id,
              type,
              file_url: uploadData.path,
            });

          if (documentError) throw documentError;
        }
      }

      toast({
        title: "Success",
        description: "Startup submission completed successfully.",
      });

      navigate(`/startups/${startup.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleSelectChange}
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  required
                >
                  <option value="">Select Industry</option>
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
                <label className="block text-sm font-medium mb-2">Founding Year</label>
                <input
                  type="number"
                  name="foundingYear"
                  value={formData.foundingYear}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Employees</label>
                <input
                  type="number"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  required
                  min="1"
                />
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={() => setStep(2)}
              className="mt-4"
              disabled={loading}
            >
              Next: Business Details
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>
            
            {/* Add step 2 fields */}
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={() => setStep(3)}
              >
                Next: Team & Documents
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Team & Documents</h2>
            
            {/* Team members */}
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-white/10 rounded-md">
                  {/* Add team member fields */}
                </div>
              ))}
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleAddTeamMember}
              >
                Add Team Member
              </Button>
            </div>
            
            {/* Document uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pitch Deck (PDF)</label>
                  <input
                    type="file"
                    name="pitchDeck"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-md bg-white/5 border border-white/10"
                  />
                </div>
                
                {/* Add other document upload fields */}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Startup"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};
