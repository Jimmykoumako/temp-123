import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Mail, Calendar, Shield, UserCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setUser(user);

      // Check if user is admin using the user_roles table
      try {
        const { data: userRoleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setIsAdmin(userRoleData?.role === 'admin');
      } catch (error) {
        console.log('Could not check user role:', error);
        setIsAdmin(false);
      }
      
    } catch (error) {
      console.error('Error checking user status:', error);
      toast({
        title: "Error",
        description: "Failed to load user information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    try {
      console.log('Submitting account deletion request for user:', user.id);
      
      // Create an account deletion request
      const { error: insertError } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: user.id,
          email: user.email || '',
          reason: 'User requested account deletion from profile page'
        });

      if (insertError) {
        console.error('Error inserting deletion request:', insertError);
        throw insertError;
      }

      console.log('Account deletion request submitted successfully');

      // Sign out the user after submitting the request
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('Error signing out:', signOutError);
        // Don't throw here, we still want to show success message
      }

      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted successfully. An administrator will process your request. You have been signed out.",
      });

      // Navigate to home page
      navigate('/');
      
    } catch (error: any) {
      console.error('Error processing account deletion:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit account deletion request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <User className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">
            Please log in to view your profile.
          </p>
          <Button onClick={() => navigate('/auth')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">User Profile</h1>
            <p className="text-slate-600">Manage your account information</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Member Since</p>
                  <p className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Account Status</p>
                  <p className="font-medium flex items-center gap-2">
                    {isAdmin ? (
                      <>
                        <span className="text-green-600">Administrator</span>
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </>
                    ) : (
                      <span className="text-blue-600">Regular User</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${user?.email_confirmed_at ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email Status</p>
                  <p className="font-medium">
                    {user?.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Admin Panel Access
                </h3>
                <p className="text-slate-600 mb-4">
                  Access the admin panel to manage hymns, hymnbooks, and audio files. All users have access to view and manage content.
                </p>
                <Button onClick={() => navigate('/admin')} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Go to Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Management */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Keep your account secure by using a strong password and enabling email verification.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Submitting an account deletion request will sign you out immediately. An administrator will process your request.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Request Account Deletion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will submit a request to delete your account. You will be signed out immediately,
                      and an administrator will process your deletion request. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAccount}
                      disabled={deleteLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteLoading ? "Processing..." : "Yes, request account deletion"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
