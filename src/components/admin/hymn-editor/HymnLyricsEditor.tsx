
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, FileText, Edit3, Upload, Download } from "lucide-react";
import VisualEditor from "./VisualEditor";
import TextImportEditor from "./TextImportEditor";
import LyricsPreview from "./LyricsPreview";
import LyricsValidatorComponent, { LyricsValidator } from "./LyricsValidator";
import BulkOperations from "./BulkOperations";
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

interface HymnData {
  id?: number;
  hymnTitleNumber: string;
  lyrics: LyricsData;
  bookId: number;
  userId?: string;
}

interface HymnLyricsEditorProps {
  hymn?: HymnData;
  onBack: () => void;
  onSave?: (hymn: HymnData) => void;
  selectedHymnbook: any;
}

const HymnLyricsEditor = ({ hymn, onBack, onSave, selectedHymnbook }: HymnLyricsEditorProps) => {
  const [activeTab, setActiveTab] = useState("visual");
  const [lyricsData, setLyricsData] = useState<LyricsData>({
    order: [],
    verses: [],
    choruses: []
  });
  const [hymnNumber, setHymnNumber] = useState("");
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hymn) {
      setLyricsData(hymn.lyrics);
      setHymnNumber(hymn.hymnTitleNumber);
    }
  }, [hymn]);

  const handleLyricsChange = (newLyricsData: LyricsData) => {
    setLyricsData(newLyricsData);
    setHasChanges(true);
  };

  const validateLyrics = () => {
    const validator = new LyricsValidator();
    return validator.validate(lyricsData);
  };

  const handleSave = async () => {
    if (!hymnNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hymn number",
        variant: "destructive",
      });
      return;
    }

    const validation = validateLyrics();
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const hymnData: HymnData = {
        hymnTitleNumber: hymnNumber,
        lyrics: lyricsData,
        bookId: selectedHymnbook?.id || 1,
        userId: (await supabase.auth.getUser()).data.user?.id || "",
      };

      if (hymn?.id) {
        // Update existing hymn
        const { error } = await supabase
          .from('HymnLyric')
          .update({
            lyrics: lyricsData as any,
            hymnTitleNumber: hymnNumber,
          })
          .eq('id', hymn.id);

        if (error) throw error;
      } else {
        // Create new hymn
        const { error } = await supabase
          .from('HymnLyric')
          .insert([{
            hymnTitleNumber: hymnData.hymnTitleNumber,
            lyrics: hymnData.lyrics as any,
            bookId: hymnData.bookId,
            userId: hymnData.userId || ""
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Hymn ${hymn?.id ? 'updated' : 'created'} successfully`,
      });

      setHasChanges(false);
      onSave?.(hymnData);
    } catch (error) {
      console.error('Error saving hymn:', error);
      toast({
        title: "Error",
        description: "Failed to save hymn lyrics",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      hymnNumber,
      lyrics: lyricsData,
      bookId: selectedHymnbook?.id,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hymn-${hymnNumber}-lyrics.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {hymn ? 'Edit' : 'Create'} Hymn Lyrics
              </h1>
              <p className="text-slate-600">
                {selectedHymnbook?.name} - Hymn #{hymnNumber || 'New'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasChanges}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Lyrics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Lyrics Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="visual" className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Visual
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="bulk" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Bulk
                    </TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visual" className="mt-6">
                    <VisualEditor
                      lyricsData={lyricsData}
                      hymnNumber={hymnNumber}
                      onLyricsChange={handleLyricsChange}
                      onHymnNumberChange={setHymnNumber}
                    />
                  </TabsContent>

                  <TabsContent value="text" className="mt-6">
                    <TextImportEditor
                      lyricsData={lyricsData}
                      onLyricsChange={handleLyricsChange}
                    />
                  </TabsContent>

                  <TabsContent value="bulk" className="mt-6">
                    <BulkOperations
                      lyricsData={lyricsData}
                      onLyricsChange={handleLyricsChange}
                      selectedHymnbook={selectedHymnbook}
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-6">
                    <LyricsPreview
                      lyricsData={lyricsData}
                      hymnNumber={hymnNumber}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LyricsValidatorComponent
              lyricsData={lyricsData}
              onValidationChange={(isValid) => console.log('Validation:', isValid)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HymnLyricsEditor;
