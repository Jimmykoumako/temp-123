
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Play, User, Music } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMusicInteractions } from '@/hooks/useMusicInteractions';

interface ActivityItem {
  id: string;
  type: 'track_like' | 'album_like' | 'playlist_create' | 'follow';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  content: {
    title: string;
    artist?: string;
    image?: string;
    description?: string;
  };
}

interface SocialMusicFeedProps {
  onPlayTrack?: (trackId: string) => void;
}

const SocialMusicFeed = ({ onPlayTrack }: SocialMusicFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleLikeTrack, isTrackLiked } = useMusicInteractions();

  // Mock data for demonstration
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'track_like',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      content: {
        title: 'Amazing Grace',
        artist: 'John Newton',
        description: 'liked this track'
      }
    },
    {
      id: '2',
      type: 'playlist_create',
      userId: 'user2',
      userName: 'Mike Wilson',
      userAvatar: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      content: {
        title: 'Sunday Morning Worship',
        description: 'created a new playlist'
      }
    },
    {
      id: '3',
      type: 'album_like',
      userId: 'user3',
      userName: 'Emily Davis',
      userAvatar: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      content: {
        title: 'Classic Hymns Collection',
        artist: 'HBC Hymns',
        description: 'liked this album'
      }
    },
    {
      id: '4',
      type: 'follow',
      userId: 'user4',
      userName: 'David Thompson',
      userAvatar: '',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      content: {
        title: 'HBC Music Ministry',
        description: 'started following'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'track_like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'album_like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'playlist_create':
        return <Music className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'track_like':
        return `liked "${activity.content.title}"`;
      case 'album_like':
        return `liked the album "${activity.content.title}"`;
      case 'playlist_create':
        return `created playlist "${activity.content.title}"`;
      case 'follow':
        return `started following ${activity.content.title}`;
      default:
        return activity.content.description || '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Social Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                <AvatarFallback>
                  {activity.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.userName}</span>
                  {getActivityIcon(activity.type)}
                  <span className="text-sm text-muted-foreground">
                    {getActivityText(activity)}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp)} ago
                </div>

                {(activity.type === 'track_like' || activity.type === 'album_like') && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    {activity.type === 'track_like' && onPlayTrack && (
                      <Button variant="ghost" size="sm" onClick={() => onPlayTrack(activity.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMusicFeed;
