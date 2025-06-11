
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Users, Monitor, Search, Music, Smartphone } from 'lucide-react';

interface FeaturesShowcaseProps {
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote' | 'audio') => void;
}

const FeaturesShowcase = ({ onModeSelect }: FeaturesShowcaseProps) => {
  const features = [
    {
      id: 'browse',
      icon: Book,
      title: 'Browse Hymnbooks',
      description: 'Explore our vast collection of traditional and contemporary hymns',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      demo: 'Try browsing our collection →'
    },
    {
      id: 'display',
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Perfect for worship services with fullscreen hymn display',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      demo: 'See presentation mode →'
    },
    {
      id: 'group',
      icon: Users,
      title: 'Group Sessions',
      description: 'Worship together remotely with synchronized hymn viewing',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      demo: 'Join a session →'
    },
    {
      id: 'lyrics',
      icon: Search,
      title: 'Search Hymns',
      description: 'Find hymns by lyrics, title, or theme instantly',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      demo: 'Search hymns →'
    },
    {
      id: 'audio',
      icon: Music,
      title: 'Audio Library',
      description: 'Listen to hymn recordings and build playlists',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      demo: 'Browse audio →'
    },
    {
      id: 'remote',
      icon: Smartphone,
      title: 'Remote Control',
      description: 'Control presentations from your mobile device',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      demo: 'Try remote control →'
    }
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need for Worship
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From personal devotion to congregational worship, our tools enhance every aspect of hymn singing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => onModeSelect(feature.id as any)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    {feature.demo}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
