
interface Hymn {
  id: string;
  number: string;
  title: string;
  author: string;
  verses: string[];
  chorus?: string;
  key: string;
  tempo: number;
}

interface HymnHymnalModeProps {
  hymn: Hymn;
  currentVerse: number;
  displaySize: string;
}

const HymnHymnalMode = ({ hymn, currentVerse, displaySize }: HymnHymnalModeProps) => {
  return (
    <>
      {hymn.verses.map((verse, index) => (
        <div 
          key={index}
          className={`p-6 rounded-lg transition-all duration-300 ${
            index === currentVerse 
              ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
              : 'bg-gray-50 opacity-70'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`font-bold text-lg ${
              index === currentVerse ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {index + 1}.
            </div>
            <div className={`${displaySize} leading-relaxed ${
              index === currentVerse ? 'text-slate-800' : 'text-slate-500'
            }`}>
              {verse.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {hymn.chorus && (
        <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-700 mb-4">Chorus</div>
            <div className={`${displaySize} leading-relaxed text-slate-800`}>
              {hymn.chorus.split('\n').map((line, idx) => (
                <div key={idx} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HymnHymnalMode;
