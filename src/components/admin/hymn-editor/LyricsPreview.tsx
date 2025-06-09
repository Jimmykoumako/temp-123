
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, Music } from "lucide-react";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface LyricsPreviewProps {
  lyricsData: LyricsData;
  hymnNumber: string;
}

const LyricsPreview = ({ lyricsData, hymnNumber }: LyricsPreviewProps) => {
  const [showSyllables, setShowSyllables] = useState(false);
  const [previewMode, setPreviewMode] = useState<'display' | 'print'>('display');

  const renderSection = (sectionId: string, index: number) => {
    let sectionData: LyricsLine[] = [];
    let sectionTitle = '';

    if (sectionId.startsWith('verse')) {
      const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
      sectionData = lyricsData.verses[verseIndex] || [];
      sectionTitle = `Verse ${verseIndex + 1}`;
    } else if (sectionId.startsWith('chorus')) {
      const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      sectionData = lyricsData.choruses[chorusIndex] || [];
      sectionTitle = `Chorus`;
    }

    return (
      <div key={`${sectionId}-${index}`} className="mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">{sectionTitle}</h3>
        <div className="space-y-2">
          {sectionData.map((line, lineIndex) => (
            <div key={lineIndex} className="leading-relaxed">
              {showSyllables ? (
                <div className="flex flex-wrap gap-1">
                  {line.syllables.map((syllable, syllableIndex) => (
                    <span 
                      key={syllableIndex} 
                      className="px-1 py-0.5 bg-blue-100 rounded text-sm"
                    >
                      {syllable}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-700 text-lg leading-relaxed">{line.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hymn ${hymnNumber} - Print Version</title>
        <style>
          body { font-family: Georgia, serif; margin: 2cm; line-height: 1.6; }
          h1 { text-align: center; margin-bottom: 2em; }
          h3 { color: #1e40af; margin-top: 2em; margin-bottom: 0.5em; }
          p { margin: 0.25em 0; }
          .section { margin-bottom: 2em; }
          @media print { body { margin: 1cm; } }
        </style>
      </head>
      <body>
        <h1>Hymn ${hymnNumber}</h1>
        ${lyricsData.order.map((sectionId, index) => {
          let sectionData: LyricsLine[] = [];
          let sectionTitle = '';

          if (sectionId.startsWith('verse')) {
            const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
            sectionData = lyricsData.verses[verseIndex] || [];
            sectionTitle = `Verse ${verseIndex + 1}`;
          } else if (sectionId.startsWith('chorus')) {
            const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
            sectionData = lyricsData.choruses[chorusIndex] || [];
            sectionTitle = `Chorus`;
          }

          return `
            <div class="section">
              <h3>${sectionTitle}</h3>
              ${sectionData.map(line => `<p>${line.text}</p>`).join('')}
            </div>
          `;
        }).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-syllables"
                checked={showSyllables}
                onCheckedChange={setShowSyllables}
              />
              <Label htmlFor="show-syllables">Show Syllables</Label>
            </div>
            <Button onClick={handlePrint} variant="outline">
              Print Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lyrics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Hymn {hymnNumber || 'Preview'}
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          {lyricsData.order.length > 0 ? (
            <div className="space-y-6">
              {lyricsData.order.map((sectionId, index) => 
                renderSection(sectionId, index)
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No lyrics to preview yet</p>
              <p className="text-sm">Add some verses or choruses to see the preview</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {lyricsData.order.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{lyricsData.verses.length}</p>
                <p className="text-sm text-gray-600">Verses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{lyricsData.choruses.length}</p>
                <p className="text-sm text-gray-600">Choruses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{lyricsData.order.length}</p>
                <p className="text-sm text-gray-600">Total Sections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {lyricsData.verses.reduce((acc, verse) => acc + verse.length, 0) + 
                   lyricsData.choruses.reduce((acc, chorus) => acc + chorus.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Lines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LyricsPreview;
