import React, { useState } from 'react';
import type { Song } from '../types/music';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  ChevronUp,
  Radio,
  PlaySquare,
  ListPlus,
  Bookmark,
  Download,
  FolderPlus,
  Disc
} from 'lucide-react';

interface InvidiousFormat {
  type: string;
  url: string;
  [key: string]: unknown;
}

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
  onStartMix?: (song: Song) => void;
  onPlayNext?: (song: Song) => void;
  onAddToQueue?: (song: Song) => void;
  onSaveToLibrary?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  onOpenAlbum?: (song: Song) => void;
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
  onTogglePlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onToggleFullscreen,
  onStartMix,
  onPlayNext,
  onAddToQueue,
  onSaveToLibrary,
  onAddToPlaylist,
  onOpenAlbum,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownloadToLaptop = async () => {
    if (!currentSong) return;
    setShowMenu(false);
    setIsDownloading(true);

    try {
      let downloadUrl = currentSong.audioUrl;

      if (!downloadUrl && currentSong.id) {
        const invidiousInstances = [
          'https://inv.riverside.rocks',
          'https://invidious.nerdvpn.de',
          'https://invidious.drgns.space'
        ];

        for (const instance of invidiousInstances) {
          try {
            const res = await fetch(`${instance}/api/v1/videos/${currentSong.id}`);
            if (res.ok) {
              const data = await res.json();
              const audioFormat = data.adaptiveFormats?.find((f: InvidiousFormat) => 
                f.type.includes('audio')
              );
              if (audioFormat?.url) {
                downloadUrl = audioFormat.url;
                break;
              }
            }
          } catch {
            continue;
          }
        }
      }

      if (downloadUrl) {
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${currentSong.title} - ${currentSong.artist}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } else {
        alert('Gagal mengambil file audio lagu ini.');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Gagal mengunduh lagu ke laptop.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentSong) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="h-16 bg-[#181818] text-white flex items-center justify-between z-40 relative select-none border-t border-neutral-800/50">
      
      {/* Progress Bar Merah */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-neutral-700/60 cursor-pointer group z-50"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPercent = clickX / rect.width;
          onSeek(newPercent * duration);
        }}
      >
        <div 
          className="h-full bg-red-600 relative transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="w-full px-6 flex items-center justify-between">
        
        {/* Controls Kiri */}
        <div className="flex items-center gap-5">
          <button 
            onClick={onPrev} 
            className="text-neutral-300 hover:text-white transition p-1"
            title="Sebelumnya"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={onTogglePlayPause} 
            className="text-white hover:scale-105 transition p-1"
            title={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={onNext} 
            className="text-neutral-300 hover:text-white transition p-1"
            title="Berikutnya"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <span className="text-xs text-neutral-400 font-normal tracking-wide ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Detail Lagu Tengah */}
        <div className="flex items-center gap-4 max-w-xl truncate px-4">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-10 h-10 rounded object-cover flex-shrink-0 cursor-pointer"
            onClick={onToggleFullscreen}
          />

          <div className="truncate text-left">
            <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentSong.title}
            </h4>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {currentSong.artist}
              {currentSong.album ? ` • ${currentSong.album}` : ''}
              {currentSong.year ? ` • ${currentSong.year}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
            <button 
              onClick={() => onToggleLike(currentSong)} 
              className={`p-1.5 rounded-full hover:bg-neutral-800 transition ${
                isLiked ? 'text-white' : 'text-neutral-300 hover:text-white'
              }`}
              title="Sukai"
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>

            <button 
              className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
              title="Tidak Suka"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>

            <button 
              onClick={handleDownloadToLaptop}
              disabled={isDownloading}
              className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition disabled:opacity-50"
              title="Download MP3 ke Laptop"
            >
              <Download className="w-4 h-4 text-red-500" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
                title="Opsi Lainnya"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 bg-[#212121] border border-neutral-800 rounded-2xl shadow-2xl z-50 py-2 text-sm text-neutral-200 font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => { setShowMenu(false); onStartMix?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <Radio className="w-4 h-4 text-neutral-300" />
                    <span>Mulai mix</span>
                  </button>

                  <button 
                    onClick={() => { setShowMenu(false); onPlayNext?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <PlaySquare className="w-4 h-4 text-neutral-300" />
                    <span>Putar setelah ini</span>
                  </button>

                  <button 
                    onClick={() => { setShowMenu(false); onAddToQueue?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <ListPlus className="w-4 h-4 text-neutral-300" />
                    <span>Tambahkan ke antrean</span>
                  </button>

                  <button 
                    onClick={() => { setShowMenu(false); onSaveToLibrary?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <Bookmark className="w-4 h-4 text-neutral-300" />
                    <span>Simpan ke koleksi</span>
                  </button>

                  <button 
                    onClick={handleDownloadToLaptop} 
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left disabled:opacity-50 text-red-500 font-semibold"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>{isDownloading ? 'Mengunduh...' : 'Download'}</span>
                  </button>

                  <button 
                    onClick={() => { setShowMenu(false); onAddToPlaylist?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <FolderPlus className="w-4 h-4 text-neutral-300" />
                    <span>Simpan ke playlist</span>
                  </button>

                  <button 
                    onClick={() => { setShowMenu(false); onOpenAlbum?.(currentSong); }} 
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                  >
                    <Disc className="w-4 h-4 text-neutral-300" />
                    <span>Buka album</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Volume & Additional Kanan */}
        <div className="flex items-center gap-4 relative">
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button 
              onClick={onToggleMute} 
              className="p-1 text-neutral-300 hover:text-white transition"
              title="Mute / Unmute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#212121] border border-neutral-800 p-2 rounded-xl shadow-xl flex items-center">
                <input 
                  type="range" 
                  min={0} 
                  max={100} 
                  value={isMuted ? 0 : volume} 
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            )}
          </div>

          <button 
            onClick={onToggleRepeat} 
            className={`p-1 transition ${
              repeatMode !== 'off' ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Ulangi"
          >
            <Repeat className="w-5 h-5" />
          </button>

          <button 
            onClick={onToggleShuffle} 
            className={`p-1 transition ${
              isShuffle ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Acak"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button 
            onClick={onToggleFullscreen} 
            className="p-1 text-neutral-300 hover:text-white transition"
            title="Mekarkan Layar"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

      </div>
    </footer>
  );
};