
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface TextImportEditorProps {
  lyricsData: LyricsData;
  onLyricsChange: (data: LyricsData) => void;
}

const TextImportEditor = ({ lyricsData, onLyricsChange }: TextImportEditorProps) => {
  const [importText, setImportText] = useState("");
  const [importFormat, setImportFormat] = useState("auto");
  const [parseResult, setParseResult] = useState<{
    success: boolean;
    data?: LyricsData;
    errors?: string[];
  } | null>(null);

  useEffect(() => {
    // Convert current lyrics data to text format for editing
    const convertToText = () => {
      let text = "";
      lyricsData.order.forEach((sectionId, index) => {
        if (sectionId.startsWith('verse')) {
          const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
          const verse = lyricsData.verses[verseIndex];
          if (verse) {
            text += `[Verse ${verseIndex + 1}]\n`;
            verse.forEach(line => {
              text += line.text + "\n";
            });
            text += "\n";
          }
        } else if (sectionId.startsWith('chorus')) {
          const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
          const chorus = lyricsData.choruses[chorusIndex];
          if (chorus) {
            text += `[Chorus ${chorusIndex + 1}]\n`;
            chorus.forEach(line => {
              text += line.text + "\n";
            });
            text += "\n";
          }
        }
      });
      setImportText(text);
    };

    if (lyricsData.order.length > 0) {
      convertToText();
    }
  }, [lyricsData]);

  const parseText = (text: string, format: string) => {
    try {
      let parsedData: LyricsData = {
        order: [],
        verses: [],
        choruses: []
      };

      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      
      if (format === "auto" || format === "bracketed") {
        // Parse bracketed format: [Verse 1], [Chorus], etc.
        let currentSection: LyricsLine[] = [];
        let currentSectionType: 'verse' | 'chorus' | null = null;
        let currentSectionIndex = 0;

        lines.forEach(line => {
          const sectionMatch = line.match(/^\[(Verse|Chorus)(?:\s+(\d+))?\]$/i);
          
          if (sectionMatch) {
            // Save previous section
            if (currentSection.length > 0 && currentSectionType) {
              if (currentSectionType === 'verse') {
                parsedData.verses.push([...currentSection]);
                parsedData.order.push(`verse${parsedData.verses.length}`);
              } else {
                parsedData.choruses.push([...currentSection]);
                parsedData.order.push(`chorus${parsedData.choruses.length}`);
              }
            }

            // Start new section
            currentSectionType = sectionMatch[1].toLowerCase() as 'verse' | 'chorus';
            currentSection = [];
          } else if (line && currentSectionType) {
            // Add line to current section
            const syllables = line.split(/[-\s]+/).filter(s => s.length > 0);
            currentSection.push({ text: line, syllables });
          }
        });

        // Save last section
        if (currentSection.length > 0 && currentSectionType) {
          if (currentSectionType === 'verse') {
            parsedData.verses.push([...currentSection]);
            parsedData.order.push(`verse${parsedData.verses.length}`);
          } else {
            parsedData.choruses.push([...currentSection]);
            parsedData.order.push(`chorus${parsedData.choruses.length}`);
          }
        }
      } else if (format === "numbered") {
        // Parse numbered format: 1., 2., etc.
        let currentSection: LyricsLine[] = [];
        let isChorus = false;

        lines.forEach(line => {
          const numberedMatch = line.match(/^(\d+)\.\s*(.*)$/);
          const chorusMatch = line.match(/^(Chorus|Refrain):?\s*(.*)$/i);
          
          if (numberedMatch || chorusMatch) {
            // Save previous section
            if (currentSection.length > 0) {
              if (isChorus) {
                parsedData.choruses.push([...currentSection]);
                parsedData.order.push(`chorus${parsedData.choruses.length}`);
              } else {
                parsedData.verses.push([...currentSection]);
                parsedData.order.push(`verse${parsedData.verses.length}`);
              }
            }

            // Start new section
            currentSection = [];
            if (chorusMatch) {
              isChorus = true;
              const remainingText = chorusMatch[2];
              if (remainingText) {
                const syllables = remainingText.split(/[-\s]+/).filter(s => s.length > 0);
                currentSection.push({ text: remainingText, syllables });
              }
            } else {
              isChorus = false;
              const remainingText = numberedMatch[2];
              if (remainingText) {
                const syllables = remainingText.split(/[-\s]+/).filter(s => s.length > 0);
                currentSection.push({ text: remainingText, syllables });
              }
            }
          } else if (line) {
            // Add line to current section
            const syllables = line.split(/[-\s]+/).filter(s => s.length > 0);
            currentSection.push({ text: line, syllables });
          }
        });

        // Save last section
        if (currentSection.length > 0) {
          if (isChorus) {
            parsedData.choruses.push([...currentSection]);
            parsedData.order.push(`chorus${parsedData.choruses.length}`);
          } else {
            parsedData.verses.push([...currentSection]);
            parsedData.order.push(`verse${parsedData.verses.length}`);
          }
        }
      }

      setParseResult({ success: true, data: parsedData });
      return parsedData;
    } catch (error) {
      setParseResult({ 
        success: false, 
        errors: [`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      });
      return null;
    }
  };

  const handleImport = () => {
    const parsedData = parseText(importText, importFormat);
    if (parsedData) {
      onLyricsChange(parsedData);
    }
  };

  const handlePreview = () => {
    parseText(importText, importFormat);
  };

  const formatExamples = {
    bracketed: `[Verse 1]
Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now I'm found
Was blind but now I see

[Chorus]
How sweet the sound
How sweet the sound
That saved a wretch like me

[Verse 2]
'Twas grace that taught my heart to fear
And grace my fears relieved`,
    
    numbered: `1. Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now I'm found
Was blind but now I see

Chorus:
How sweet the sound
How sweet the sound
That saved a wretch like me

2. 'Twas grace that taught my heart to fear
And grace my fears relieved`
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Text Import & Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="import-format">Import Format</Label>
            <Select value={importFormat} onValueChange={setImportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="bracketed">Bracketed ([Verse 1], [Chorus])</SelectItem>
                <SelectItem value="numbered">Numbered (1., 2., Chorus:)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="import-text">Lyrics Text</Label>
            <Textarea
              id="import-text"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste or type your lyrics here..."
              className="min-h-[300px] font-mono"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="outline">
              Preview Parse
            </Button>
            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Import Lyrics
            </Button>
          </div>

          {parseResult && (
            <Alert className={parseResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {parseResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                {parseResult.success ? (
                  <div>
                    <p className="font-medium text-green-800">Parse successful!</p>
                    <p className="text-green-700">
                      Found {parseResult.data?.verses.length || 0} verses and {parseResult.data?.choruses.length || 0} choruses
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-red-800">Parse failed</p>
                    <ul className="list-disc list-inside text-red-700">
                      {parseResult.errors?.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Format Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Bracketed Format</h4>
            <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap font-mono">
              {formatExamples.bracketed}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Numbered Format</h4>
            <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap font-mono">
              {formatExamples.numbered}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextImportEditor;
