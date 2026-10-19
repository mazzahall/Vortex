import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, Heart, Music2, Mic2, List, Maximize2
} from 'lucide-react';
import type { Song } from '../types/music';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isLiked: boolean;
  showLyrics: boolean;
  showQueue: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: (song: Song) => void;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onToggleFullscreen: () => void;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isLiked,
  showLyrics,
  showQueue,
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onToggleLyrics,
  onToggleQueue,
  onToggleFullscreen,
}) => {
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <footer className="h-24 bg-[#0b0813]/90 border-t border-slate-800/80 px-6 flex items-center justify-between z-40 backdrop-blur-2xl shrink-0">
      <div className="flex items-center gap-4 w-1/4">
        {currentSong ? (
          <>
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700/50 shadow-md relative group shrink-0">
              <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm text-slate-100 truncate hover:underline cursor-pointer">
                {currentSong.title}
              </span>
              <span className="text-xs text-slate-400 truncate hover:underline cursor-pointer">
                {currentSong.artist}
              </span>
            </div>
            <button
              onClick={() => onToggleLike(currentSong)}
              className={`p-2 transition ${isLiked ? 'text-violet-500 hover:scale-110' : 'text-slate-400 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
              <Music2 className="w-6 h-6" />
            </div>
            <span className="text-xs">Pilih lagu untuk diputar</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
        <div className="flex items-center gap-5">
          <button 
            onClick={onToggleShuffle}
            className={`transition ${isShuffle ? 'text-violet-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button onClick={onPrev} className="text-slate-300 hover:text-white transition">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onTogglePlayPause}
            disabled={!currentSong}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button onClick={onNext} className="text-slate-300 hover:text-white transition">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={onToggleRepeat}
            className={`relative transition ${repeatMode !== 'off' ? 'text-violet-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-violet-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        <div className="w-full flex items-center gap-3 text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-1/4">
        <button 
          onClick={onToggleLyrics}
          className={`transition ${showLyrics ? 'text-violet-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Mic2 className="w-5 h-5" />
        </button>

        <button 
          onClick={onToggleQueue}
          className={`transition ${showQueue ? 'text-violet-400' : 'text-slate-400 hover:text-white'}`}
        >
          <List className="w-5 h-5" />
        </button>

        <button onClick={onToggleFullscreen} className="text-slate-400 hover:text-white transition">
          <Maximize2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={onToggleMute} className="text-slate-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
        </div>
      </div>
    </footer>
  );
};