
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BarChart3, Music, Volume2, Users, BookOpen, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalHymnbooks: number;
  activeHymnbooks: number;
  totalHymns: number;
  totalLyrics: number;
  totalAudioFiles: number;
  totalUserRoles: number;
}

const StatsDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHymnbooks: 0,
    activeHymnbooks: 0,
    totalHymns: 0,
    totalLyrics: 0,
    totalAudioFiles: 0,
    totalUserRoles: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch hymnbook stats
      const { data: hymnbookData, error: hymnbookError } = await supabase
        .from('HymnBook')
        .select('is_active');

      if (hymnbookError) throw hymnbookError;

      const totalHymnbooks = hymnbookData?.length || 0;
      const activeHymnbooks = hymnbookData?.filter(book => book.is_active).length || 0;

      // Fetch hymn titles count
      const { count: hymnTitlesCount, error: titlesError } = await supabase
        .from('HymnTitle')
        .select('*', { count: 'exact', head: true });

      if (titlesError) throw titlesError;

      // Fetch lyrics count
      const { count: lyricsCount, error: lyricsError } = await supabase
        .from('HymnLyric')
        .select('*', { count: 'exact', head: true });

      if (lyricsError) throw lyricsError;

      // Fetch audio files count
      const { count: audioCount, error: audioError } = await supabase
        .from('AudioFile')
        .select('*', { count: 'exact', head: true });

      if (audioError) throw audioError;

      // Fetch user roles count instead of users count
      const { count: userRolesCount, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (userRolesError) throw userRolesError;

      setStats({
        totalHymnbooks,
        activeHymnbooks,
        totalHymns: hymnTitlesCount || 0,
        totalLyrics: lyricsCount || 0,
        totalAudioFiles: audioCount || 0,
        totalUserRoles: userRolesCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading dashboard statistics...</div>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Total Hymnbooks",
      value: stats.totalHymnbooks,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Hymnbooks",
      value: stats.activeHymnbooks,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Hymns",
      value: stats.totalHymns,
      icon: Music,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Hymns with Lyrics",
      value: stats.totalLyrics,
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Audio Files",
      value: stats.totalAudioFiles,
      icon: Volume2,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "User Roles",
      value: stats.totalUserRoles,
      icon: Users,
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">System Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`p-4 ${stat.bgColor} border-0`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <p>• {((stats.activeHymnbooks / Math.max(stats.totalHymnbooks, 1)) * 100).toFixed(1)}% of hymnbooks are active</p>
              <p>• {((stats.totalLyrics / Math.max(stats.totalHymns, 1)) * 100).toFixed(1)}% of hymns have lyrics</p>
            </div>
            <div>
              <p>• {((stats.totalAudioFiles / Math.max(stats.totalHymns, 1)) * 100).toFixed(1)}% coverage with audio files</p>
              <p>• {stats.totalUserRoles} user roles configured in the system</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsDashboard;
