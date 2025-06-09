
import { Book, Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Book className="w-20 h-20 text-primary" />
              <Heart className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Welcome to Digital Hymnbook
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Empowering congregational worship with modern technology for timeless songs of praise
          </p>
        </div>

        {/* Scripture Verse */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-white/20">
          <blockquote className="text-2xl md:text-3xl font-serif text-slate-700 italic leading-relaxed mb-4">
            "Rejoice in the LORD, O ye righteous: for praise is comely for the upright."
          </blockquote>
          <cite className="text-lg text-slate-600 font-medium">— Psalm 33:1 (KJV)</cite>
        </div>

        {/* Audience-Specific Welcome */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Heart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">For Worship Leaders</h3>
            <p className="text-muted-foreground">
              Lead your congregation with confidence using synchronized displays, remote controls, and seamless group sessions.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">For Congregations</h3>
            <p className="text-muted-foreground">
              Join in unified worship with clear lyrics, easy navigation, and tools designed to enhance your singing experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
