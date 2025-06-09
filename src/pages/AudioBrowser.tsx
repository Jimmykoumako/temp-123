
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, FileAudio } from 'lucide-react';

interface AudioFile {
  id: string;
  url: string;
  hymnTitleNumber: string;
  userId: string;
  audioTypeId: number;
  createdAt: string;
  bookId: number;
}

const AudioBrowser = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('AudioFile')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching audio files:', error);
        toast({
          title: "Error",
          description: "Failed to fetch audio files",
          variant: "destructive"
        });
        return;
      }

      setAudioFiles(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAudioUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('audio_files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const playAudio = async (audioFile: AudioFile) => {
    try {
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }

      if (playingAudio === audioFile.id) {
        setPlayingAudio(null);
        return;
      }

      const audioUrl = getAudioUrl(audioFile.url);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
        setAudioElement(null);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Playback Error",
          description: "Could not play this audio file",
          variant: "destructive"
        });
        setPlayingAudio(null);
        setAudioElement(null);
      });

      await audio.play();
      setAudioElement(audio);
      setPlayingAudio(audioFile.id);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback Error",
        description: "Could not play this audio file",
        variant: "destructive"
      });
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setPlayingAudio(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <FileAudio className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg">Loading audio files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Audio Library</h1>
          <p className="text-muted-foreground">
            Browse and play hymn audio recordings ({audioFiles.length} files available)
          </p>
        </div>

        {audioFiles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileAudio className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Audio Files Found</h3>
              <p className="text-muted-foreground text-center">
                No audio files are currently available in the library.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioFiles.map((audioFile) => (
              <Card key={audioFile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-5 w-5" />
                    Hymn #{audioFile.hymnTitleNumber}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p>Book ID: {audioFile.bookId}</p>
                      <p>Audio Type: {audioFile.audioTypeId}</p>
                      <p>Uploaded: {formatDate(audioFile.createdAt)}</p>
                    </div>
                    
                    <Button
                      onClick={() => playAudio(audioFile)}
                      className="w-full"
                      variant={playingAudio === audioFile.id ? "secondary" : "default"}
                    >
                      {playingAudio === audioFile.id ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Stop Playing
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Play Audio
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioBrowser;
