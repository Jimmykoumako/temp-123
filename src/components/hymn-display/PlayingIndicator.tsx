
interface PlayingIndicatorProps {
  isPlaying: boolean;
}

const PlayingIndicator = ({ isPlaying }: PlayingIndicatorProps) => {
  if (!isPlaying) return null;

  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Playing
      </div>
    </div>
  );
};

export default PlayingIndicator;
