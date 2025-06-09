
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Users, Book, Music, Upload, Shield, UserCheck, BarChart3, HardDrive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import HymnbookManager from "@/components/admin/HymnbookManager";
import HymnManager from "@/components/admin/HymnManager";
import AudioManager from "@/components/admin/AudioManager";
import UserRoleManager from "@/components/admin/UserRoleManager";
import StatsDashboard from "@/components/admin/StatsDashboard";
import StorageManager from "@/components/admin/StorageManager";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewAsAdmin, setViewAsAdmin] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'hymnbooks', label: 'Hymnbooks', icon: Book },
    { id: 'hymns', label: 'Hymns', icon: Music },
    { id: 'audio', label: 'Audio Files', icon: Upload },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'users', label: 'User Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage hymns, hymnbooks, and audio files</p>
            {currentUser && (
              <p className="text-sm text-slate-500 mt-1">Welcome, {currentUser.email}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-view"
                checked={viewAsAdmin}
                onCheckedChange={setViewAsAdmin}
              />
              <Label htmlFor="admin-view" className="flex items-center gap-2">
                {viewAsAdmin ? (
                  <>
                    <Shield className="w-4 h-4 text-green-600" />
                    Admin View
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    User View
                  </>
                )}
              </Label>
            </div>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {!viewAsAdmin && (
          <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">User View Mode</h3>
                <p className="text-blue-600 text-sm">
                  You're viewing the interface as a regular user. Some features may be hidden or read-only.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isVisible = viewAsAdmin || tab.id === 'overview';
              
              if (!isVisible) return null;
              
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  disabled={!viewAsAdmin && tab.id !== 'overview'}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {!viewAsAdmin && tab.id !== 'overview' && (
                    <Shield className="w-3 h-3 ml-auto text-slate-400" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <StatsDashboard />}
            {viewAsAdmin && activeTab === 'hymnbooks' && <HymnbookManager />}
            {viewAsAdmin && activeTab === 'hymns' && <HymnManager />}
            {viewAsAdmin && activeTab === 'audio' && <AudioManager />}
            {viewAsAdmin && activeTab === 'storage' && <StorageManager />}
            {viewAsAdmin && activeTab === 'users' && <UserRoleManager />}
            
            {!viewAsAdmin && activeTab !== 'overview' && (
              <Card className="p-6 text-center">
                <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Admin Access Required</h3>
                <p className="text-slate-500">
                  Switch to admin view to access this feature.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
