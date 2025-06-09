
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Shield, User } from "lucide-react";

const UserRoleManager = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      // Since we can't directly query auth.users, we'll get user roles
      // and show user IDs. In a real app, you'd have a profiles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserRole = async () => {
    if (!newUserEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user email.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you'd look up the user by email in your profiles table
      // For now, we'll show that this would require the user ID
      toast({
        title: "Note",
        description: "To assign roles, you need the user's UUID. In a production app, you'd look this up by email in a profiles table.",
        variant: "default",
      });

      setNewUserEmail('');
    } catch (error) {
      console.error('Error adding user role:', error);
      toast({
        title: "Error",
        description: "Failed to add user role.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (roleId) => {
    if (!confirm('Are you sure you want to remove this role?')) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role removed successfully.",
      });

      fetchUserRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove user role.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading user roles...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">User Role Management</h2>
        
        {/* Add Role Form */}
        <Card className="p-4 mb-6 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">Assign User Role</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAddUserRole}>
            <Plus className="w-4 h-4 mr-2" />
            Assign Role
          </Button>
          <p className="text-sm text-slate-600 mt-2">
            Note: In a production app, you'd need a profiles table to look up users by email.
          </p>
        </Card>

        {/* Current Roles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current User Roles</h3>
          {userRoles.length === 0 ? (
            <Card className="p-4">
              <p className="text-center text-slate-600">No user roles assigned yet.</p>
            </Card>
          ) : (
            userRoles.map((userRole) => (
              <Card key={userRole.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {userRole.role === 'admin' ? (
                      <Shield className="w-5 h-5 text-red-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {userRole.role === 'admin' ? 'Administrator' : 'User'}
                      </p>
                      <p className="text-sm text-slate-600">
                        User ID: {userRole.user_id}
                      </p>
                      <p className="text-xs text-slate-500">
                        Assigned: {new Date(userRole.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveRole(userRole.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserRoleManager;
