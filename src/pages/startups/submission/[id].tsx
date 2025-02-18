
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StartupForm } from "@/components/startups/StartupForm";
import { supabase } from "@/integrations/supabase/client";

const StartupSubmissionPage = () => {
  const { id } = useParams();
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSubmissionUrl = async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('id, submission_url')
        .eq('submission_url', id)
        .single();

      if (!error && data) {
        setValid(true);
      }
      setLoading(false);
    };

    validateSubmissionUrl();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Submission Link</h1>
          <p className="text-gray-400">This submission link is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Startup Submission Form</h1>
        <StartupForm />
      </div>
    </div>
  );
};

export default StartupSubmissionPage;
