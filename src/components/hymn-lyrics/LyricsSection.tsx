
interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsSectionProps {
  lines: LyricsLine[];
  sectionType: 'verse' | 'chorus';
  index: number;
  showSyllables: boolean;
}

const LyricsSection = ({ lines, sectionType, index, showSyllables }: LyricsSectionProps) => {
  return (
    <div className={`p-6 rounded-lg mb-4 ${
      sectionType === 'chorus' 
        ? 'bg-blue-50 border-2 border-blue-200' 
        : 'bg-slate-50 border border-slate-200'
    }`}>
      <div className="text-center mb-4">
        <span className={`font-semibold text-lg ${
          sectionType === 'chorus' ? 'text-blue-700' : 'text-slate-700'
        }`}>
          {sectionType === 'chorus' ? 'Chorus' : `Verse ${index + 1}`}
        </span>
      </div>
      <div className="space-y-3">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="text-center">
            <div className="text-xl leading-relaxed text-slate-800 mb-1">
              {line.text}
            </div>
            {showSyllables && (
              <div className="text-sm text-slate-500 font-mono">
                {line.syllables.join(' • ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricsSection;
