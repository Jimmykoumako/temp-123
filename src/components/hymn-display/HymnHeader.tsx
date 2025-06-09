
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

interface HymnHeaderProps {
  hymn: Hymn;
  isLyricsOnly: boolean;
  titleSize: string;
}

const HymnHeader = ({ hymn, isLyricsOnly, titleSize }: HymnHeaderProps) => {
  if (isLyricsOnly) return null;

  return (
    <div className="text-center mb-8">
      <div className="text-blue-600 font-bold text-xl mb-2">#{hymn.number}</div>
      <h1 className={`${titleSize} font-bold text-slate-800 mb-4`}>{hymn.title}</h1>
      <p className="text-slate-600">by {hymn.author}</p>
      <div className="text-sm text-slate-500 mt-2">
        Key: {hymn.key} • Tempo: {hymn.tempo} BPM
      </div>
    </div>
  );
};

export default HymnHeader;
