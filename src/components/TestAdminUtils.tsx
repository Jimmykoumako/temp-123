
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield, UserPlus } from "lucide-react";

const TestAdminUtils = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makeCurrentUserAdmin = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "No user is currently logged in.",
          variant: "destructive",
        });
        return;
      }

      // Insert the current user as admin
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' });

      if (error && error.code !== '23505') { // 23505 is unique constraint violation (already exists)
        throw error;
      }

      toast({
        title: "Success!",
        description: "Current user has been granted admin privileges.",
      });
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant admin privileges.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <div className="text-center mb-4">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Testing Utilities</h3>
        <p className="text-sm text-slate-600">
          For development and testing purposes only
        </p>
      </div>
      
      <Button 
        onClick={makeCurrentUserAdmin}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Make Current User Admin
          </>
        )}
      </Button>
      
      <p className="text-xs text-slate-500 mt-4 text-center">
        This will grant admin privileges to the currently logged-in user.
        Make sure you're logged in before clicking this button.
      </p>
    </Card>
  );
};

export default TestAdminUtils;
