import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ThumbsUp, 
  ThumbsDown, 
  MoreVertical, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  ChevronUp 
} from 'lucide-react';
import type { Song } from '../types/music';

export interface PlayerProps {
  currentSong?: Song | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
  isMuted?: boolean;
  isShuffle?: boolean;
  repeatMode?: 'off' | 'all' | 'one';
  isLiked?: boolean;
  showLyrics?: boolean;
  showQueue?: boolean;
  onTogglePlayPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSeek?: (sec: number) => void;
  onVolumeChange?: (v: number) => void;
  onToggleMute?: () => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onToggleLike?: (song: Song) => void;
  onToggleLyrics?: () => void;
  onToggleQueue?: () => void;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
}

export default function Player({
  currentSong,
  isPlaying,
  currentTime = 0,
  duration = 0,
  volume = 80,
  isMuted = false,
  isShuffle = false,
  repeatMode = 'off',
  isLiked = false,
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onToggleFullscreen
}: PlayerProps) {
  if (!currentSong) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSec = Number(e.target.value);
    if (onSeek) onSeek(newSec);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    if (onVolumeChange) onVolumeChange(newVol);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#000000] text-white z-50 flex flex-col select-none border-t border-neutral-900">
      {/* Progress Bar Merah YouTube Music */}
      <div className="relative w-full h-1 group cursor-pointer bg-neutral-800">
        <div 
          className="bg-red-600 h-full relative" 
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md transform scale-100 group-hover:scale-125 transition-transform" />
        </div>
        <input 
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      {/* Bar Utama Player */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        
        {/* Sisi Kiri: Kontrol Pemutar & Durasi */}
        <div className="flex items-center gap-5">
          <button type="button" onClick={onPrev} className="text-white hover:opacity-80 transition">
            <SkipBack className="w-5 h-5 fill-white" />
          </button>
          
          <button type="button" onClick={onTogglePlayPause} className="text-white hover:opacity-80 transition">
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white" />
            )}
          </button>
          
          <button type="button" onClick={onNext} className="text-white hover:opacity-80 transition">
            <SkipForward className="w-5 h-5 fill-white" />
          </button>

          <span className="text-xs font-mono text-neutral-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Sisi Tengah: Info Lagu */}
        <div className="flex items-center gap-4 max-w-md truncate">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
          <div className="truncate text-left">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-neutral-400 truncate">
              {currentSong.artist} • {currentSong.album || currentSong.title} {currentSong.year ? `• ${currentSong.year}` : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button 
              type="button"
              onClick={() => onToggleLike && onToggleLike(currentSong)} 
              className={`p-1.5 rounded-full hover:bg-neutral-800 transition ${isLiked ? 'text-white' : 'text-neutral-400'}`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>
            <button type="button" className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition">
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button type="button" className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Slider Volume, Repeat, Shuffle, Fullscreen */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group">
            <button type="button" onClick={onToggleMute} className="text-neutral-400 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={100} 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange} 
              className="w-20 h-1 accent-red-600 bg-neutral-700 cursor-pointer"
            />
          </div>

          <button 
            type="button"
            onClick={onToggleRepeat} 
            className={`transition ${repeatMode !== 'off' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>

          <button 
            type="button"
            onClick={onToggleShuffle} 
            className={`transition ${isShuffle ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button type="button" onClick={onToggleFullscreen} className="text-neutral-400 hover:text-white transition">
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}