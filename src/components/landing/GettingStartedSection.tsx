
import { Button } from "@/components/ui/button";
import { Library, Users, Monitor } from "lucide-react";

interface GettingStartedSectionProps {
  isLandscape: boolean;
  onModeSelect: (mode: 'browse' | 'group') => void;
}

const GettingStartedSection = ({ isLandscape, onModeSelect }: GettingStartedSectionProps) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Begin?</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Start by browsing our hymnbook collection, or jump directly into group worship. 
            Every tool is designed to enhance the beauty of congregational praise.
          </p>
          {isLandscape && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <Monitor className="w-4 h-4 inline mr-2" />
                Landscape mode detected - presentation mode will be optimized for your display.
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onModeSelect('browse')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Library className="w-5 h-5 mr-2" />
              Start Browsing
            </Button>
            <Button 
              onClick={() => onModeSelect('group')}
              variant="outline" 
              size="lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Group Session
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStartedSection;
