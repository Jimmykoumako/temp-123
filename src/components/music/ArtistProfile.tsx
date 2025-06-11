
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Music, Heart, UserPlus, UserMinus, ExternalLink, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ArtistProfileData {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  socialMediaLinks?: any;
  genre?: string;
  trackCount: number;
  albumCount: number;
  followerCount: number;
  isFollowing: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
  album?: string;
}

interface ArtistProfileProps {
  artistId: string;
  onPlayTrack: (track: Track) => void;
}

const ArtistProfile = ({ artistId, onPlayTrack }: ArtistProfileProps) => {
  const [artist, setArtist] = useState<ArtistProfileData | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const { toast } = useToast();

  const fetchArtistProfile = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', artistId)
        .single();

      if (userError) throw userError;

      // Fetch artist profile data
      const { data: artistData } = await supabase
        .from('ArtistProfile')
        .select('*')
        .eq('userId', artistId)
        .single();

      // Fetch artist tracks
      const { data: trackData } = await supabase
        .from('Track')
        .select('*')
        .limit(10);

      // Mock follower count and following status
      const followerCount = Math.floor(Math.random() * 1000) + 50;
      const isFollowing = false; // Would check from Follow table

      const artistProfile: ArtistProfileData = {
        id: artistId,
        userId: artistId,
        name: userData?.name || 'Unknown Artist',
        bio: userData?.bio,
        profilePicture: userData?.profilePicture,
        website: artistData?.website,
        socialMediaLinks: artistData?.socialMediaLinks,
        genre: artistData?.genre || 'Hymns',
        trackCount: trackData?.length || 0,
        albumCount: 1, // Mock data
        followerCount,
        isFollowing
      };

      const formattedTracks: Track[] = (trackData || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: artistProfile.name,
        url: track.url,
        duration: '3:45',
        album: 'HBC Collection'
      }));

      setArtist(artistProfile);
      setTracks(formattedTracks);
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!artist) return;
    
    setFollowLoading(true);
    try {
      const currentUserId = 'user-' + Math.random().toString(36).substr(2, 9); // Mock user ID
      
      if (artist.isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('Follow')
          .delete()
          .eq('followerId', currentUserId)
          .eq('followingId', artistId);

        if (error) throw error;

        setArtist(prev => prev ? {
          ...prev,
          isFollowing: false,
          followerCount: prev.followerCount - 1
        } : null);

        toast({
          title: "Unfollowed",
          description: `You unfollowed ${artist.name}`
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('Follow')
          .insert({
            followerId: currentUserId,
            followingId: artistId
          });

        if (error) throw error;

        setArtist(prev => prev ? {
          ...prev,
          isFollowing: true,
          followerCount: prev.followerCount + 1
        } : null);

        toast({
          title: "Following",
          description: `You are now following ${artist.name}`
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistProfile();
  }, [artistId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32" />
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!artist) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Artist Not Found</h3>
          <p className="text-muted-foreground">The requested artist profile could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Artist Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={artist.profilePicture} alt={artist.name} />
              <AvatarFallback className="text-2xl">
                {artist.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  {artist.genre} Artist
                </p>
              </div>

              {artist.bio && (
                <p className="text-muted-foreground">{artist.bio}</p>
              )}

              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {artist.trackCount} tracks
                </Badge>
                <Badge variant="secondary">
                  {artist.albumCount} albums
                </Badge>
                <Badge variant="secondary">
                  {artist.followerCount} followers
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  variant={artist.isFollowing ? "outline" : "default"}
                >
                  {artist.isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>

                {artist.website && (
                  <Button variant="outline" asChild>
                    <a href={artist.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg group cursor-pointer"
                onClick={() => onPlayTrack(track)}
              >
                <span className="text-sm text-muted-foreground w-6 text-center">
                  {index + 1}
                </span>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.album}</p>
                </div>

                <span className="text-sm text-muted-foreground">
                  {track.duration}
                </span>

                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistProfile;
