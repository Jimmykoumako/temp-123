
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio, Music } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <Music className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">HBC Hymns Library</h1>
          <p className="text-xl text-muted-foreground">
            Access and browse your collection of hymn audio recordings
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <FileAudio className="h-6 w-6" />
              Audio Library
            </CardTitle>
            <CardDescription>
              Browse and play hymn audio files from your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/audio">
              <Button size="lg" className="w-full">
                Browse Audio Files
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Your audio files are securely stored and ready to access
        </p>
      </div>
    </div>
  );
};

export default Index;
