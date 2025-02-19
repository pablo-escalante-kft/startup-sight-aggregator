
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.get('fullName'),
          role: formData.get('role'),
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dark p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="max-w-2xl">
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input 
                  name="fullName" 
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Role
                </label>
                <Input 
                  name="role" 
                  placeholder="Enter your role"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                Save Changes
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Analysis Reports</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Settings;
