
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, FileText, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface BulkOperationsProps {
  lyricsData: LyricsData;
  onLyricsChange: (data: LyricsData) => void;
  selectedHymnbook: any;
}

const BulkOperations = ({ lyricsData, onLyricsChange, selectedHymnbook }: BulkOperationsProps) => {
  const [bulkText, setBulkText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some lyrics to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      // Parse the bulk text - expecting format like:
      // VERSE 1
      // Line 1
      // Line 2
      //
      // CHORUS
      // Chorus line 1
      // Chorus line 2
      //
      // VERSE 2
      // etc.

      const lines = bulkText.split('\n');
      const newVerses: LyricsLine[][] = [];
      const newChoruses: LyricsLine[][] = [];
      const newOrder: string[] = [];

      let currentSection: 'verse' | 'chorus' | null = null;
      let currentSectionIndex = 0;
      let currentLines: LyricsLine[] = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.toUpperCase().startsWith('VERSE')) {
          // Save previous section
          if (currentSection && currentLines.length > 0) {
            if (currentSection === 'verse') {
              newVerses.push([...currentLines]);
            } else {
              newChoruses.push([...currentLines]);
            }
          }
          
          currentSection = 'verse';
          currentSectionIndex = newVerses.length + 1;
          newOrder.push(`verse${currentSectionIndex}`);
          currentLines = [];
        } else if (trimmedLine.toUpperCase().startsWith('CHORUS')) {
          // Save previous section
          if (currentSection && currentLines.length > 0) {
            if (currentSection === 'verse') {
              newVerses.push([...currentLines]);
            } else {
              newChoruses.push([...currentLines]);
            }
          }
          
          currentSection = 'chorus';
          currentSectionIndex = newChoruses.length + 1;
          newOrder.push(`chorus${currentSectionIndex}`);
          currentLines = [];
        } else if (trimmedLine && currentSection) {
          // Regular lyrics line
          const syllables = trimmedLine.split(/[-\s]+/).filter(s => s.length > 0);
          currentLines.push({
            text: trimmedLine,
            syllables
          });
        }
      }

      // Save the last section
      if (currentSection && currentLines.length > 0) {
        if (currentSection === 'verse') {
          newVerses.push([...currentLines]);
        } else {
          newChoruses.push([...currentLines]);
        }
      }

      onLyricsChange({
        order: newOrder,
        verses: newVerses,
        choruses: newChoruses
      });

      toast({
        title: "Success",
        description: "Lyrics imported successfully",
      });

      setBulkText("");
    } catch (error) {
      console.error('Error importing lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to import lyrics",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkSave = async () => {
    if (!selectedHymnbook?.id) {
      toast({
        title: "Error",
        description: "Please select a hymnbook first",
        variant: "destructive",
      });
      return;
    }

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save lyrics",
          variant: "destructive",
        });
        return;
      }

      // For now, we'll just save the current lyrics data
      // In a real implementation, you might want to parse multiple hymns from the bulk text
      const hymnData = {
        hymnTitleNumber: "BULK_IMPORT_" + Date.now(),
        lyrics: lyricsData as any, // Type cast to satisfy Supabase
        bookId: selectedHymnbook.id,
        userId: user.data.user.id
      };

      const { error } = await supabase
        .from('HymnLyric')
        .insert([hymnData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lyrics saved successfully",
      });
    } catch (error) {
      console.error('Error saving lyrics:', error);
      toast({
        title: "Error",
        description: "Failed to save lyrics",
        variant: "destructive",
      });
    }
  };

  const exportCurrentLyrics = () => {
    let exportText = "";
    
    lyricsData.order.forEach((sectionId) => {
      if (sectionId.startsWith('verse')) {
        const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
        const verse = lyricsData.verses[verseIndex];
        if (verse) {
          exportText += `VERSE ${verseIndex + 1}\n`;
          verse.forEach(line => {
            exportText += `${line.text}\n`;
          });
          exportText += "\n";
        }
      } else if (sectionId.startsWith('chorus')) {
        const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
        const chorus = lyricsData.choruses[chorusIndex];
        if (chorus) {
          exportText += `CHORUS\n`;
          chorus.forEach(line => {
            exportText += `${line.text}\n`;
          });
          exportText += "\n";
        }
      }
    });

    setBulkText(exportText);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-text">Paste Lyrics</Label>
              <p className="text-sm text-gray-600 mb-2">
                Format: Start each section with "VERSE 1", "CHORUS", etc.
              </p>
              <Textarea
                id="bulk-text"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`VERSE 1
Amazing grace how sweet the sound
That saved a wretch like me

CHORUS
How great thou art
How great thou art

VERSE 2
I once was lost but now am found
Was blind but now I see`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleBulkImport} disabled={isImporting || !bulkText.trim()}>
                {isImporting ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Import Lyrics
              </Button>
              
              <Button onClick={exportCurrentLyrics} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Current
              </Button>
              
              <Button onClick={handleBulkSave} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Save to Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Format Guidelines:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Start each verse with "VERSE 1", "VERSE 2", etc.</li>
              <li>Start each chorus with "CHORUS"</li>
              <li>Leave empty lines between sections</li>
              <li>Each line of lyrics should be on its own line</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
