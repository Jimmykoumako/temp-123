
import { Book, Smartphone, Monitor, Users, Library, FileText } from "lucide-react";

interface FeaturesGridProps {
  onModeSelect: (mode: 'browse' | 'lyrics' | 'group' | 'hymnal' | 'display' | 'remote') => void;
}

const FeaturesGrid = ({ onModeSelect }: FeaturesGridProps) => {
  const features = [
    {
      id: 'browse',
      icon: Library,
      title: 'Browse Hymnbooks',
      description: 'Explore our collection of traditional and contemporary hymnbooks',
      color: 'text-blue-600',
    },
    {
      id: 'lyrics',
      icon: FileText,
      title: 'Study Lyrics',
      description: 'Dive deep into hymn lyrics with detailed syllable breakdowns',
      color: 'text-indigo-600',
    },
    {
      id: 'group',
      icon: Users,
      title: 'Group Worship',
      description: 'Create or join synchronized sessions for unified singing',
      color: 'text-emerald-600',
    },
    {
      id: 'hymnal',
      icon: Book,
      title: 'Personal Practice',
      description: 'Practice hymns at your own pace with guided assistance',
      color: 'text-green-600',
    },
    {
      id: 'display',
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Display hymns for congregation or projection screens',
      color: 'text-purple-600',
    },
    {
      id: 'remote',
      icon: Smartphone,
      title: 'Remote Control',
      description: 'Control presentations from your mobile device',
      color: 'text-orange-600',
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Worship Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're leading worship, practicing at home, or joining group singing, 
            we have the perfect tools for every moment of praise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id}
                onClick={() => onModeSelect(feature.id as any)}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group"
              >
                <div className="text-center">
                  <IconComponent className={`w-12 h-12 ${feature.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
