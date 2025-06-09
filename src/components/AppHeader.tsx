
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Book, Settings, Info, Github, Monitor, LogIn, LogOut, User, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface AppHeaderProps {
  onModeSelect?: (mode: 'select' | 'hymnal' | 'remote' | 'display' | 'browse') => void;
}

const AppHeader = ({ onModeSelect }: AppHeaderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse':
        onModeSelect?.('browse');
        break;
      case 'display':
        onModeSelect?.('display');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'about':
        alert('Digital Hymnbook - Empowering congregational worship with modern technology for timeless songs of praise. Built with love for worship leaders and congregations everywhere.');
        break;
      case 'login':
        navigate('/auth');
        break;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Book className="w-8 h-8 text-primary" />
              <Heart className="w-3 h-3 text-red-500 absolute -top-0.5 -right-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Digital Hymnbook</h1>
              <p className="text-sm text-muted-foreground">Worship made beautiful</p>
            </div>
          </div>

          {/* Quick Actions and Auth */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('browse')}
              className="hidden sm:flex bg-white/50 hover:bg-white/80"
            >
              <Book className="w-4 h-4 mr-2" />
              Browse Hymns
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('display')}
              className="hidden md:flex bg-white/50 hover:bg-white/80"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Quick Display
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('about')}
              className="hover:bg-white/50"
            >
              <Info className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('admin')}
              className="hover:bg-white/50"
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-white/50"
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>

            {/* Authentication Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction('profile')}
                      className="hidden sm:flex hover:bg-white/50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <div className="hidden lg:flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Welcome, {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="bg-white/50 hover:bg-white/80"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction('login')}
                      className="bg-white/50 hover:bg-white/80"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
