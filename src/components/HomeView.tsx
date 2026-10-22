import React, { useState, useRef, useEffect } from 'react';
import type { Song } from '../types/music';
import { 
  Play, 
  ThumbsUp, 
  ThumbsDown, 
  MoreVertical,
  Radio,
  PlaySquare,
  ListPlus,
  Bookmark,
  Download,
  FolderPlus,
  Disc
} from 'lucide-react';

interface HomeViewProps {
  songs: Song[];
  history: Song[];
  onSelectSong: (index: number, list?: Song[]) => void;
  onGoToSearch: (query?: string) => void;
  onPlayNext?: (song: Song) => void;
  onAddToQueue?: (song: Song) => void;
  onToggleLike?: (song: Song) => void;
  onSaveToPlaylist?: (song: Song) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  songs,
  onSelectSong,
  onGoToSearch,
  onPlayNext,
  onAddToQueue,
  onToggleLike,
  onSaveToPlaylist,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadSong = async (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setDownloadingId(song.id);

    try {
      if (song.audioUrl) {
        const link = document.createElement('a');
        link.href = song.audioUrl;
        link.download = `${song.title} - ${song.artist}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (song.id) {
        // Menggunakan Cobalt API untuk langsung mengambil direct stream file MP3
        const response = await fetch('https://co.wuk.sh/api/json', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: `https://www.youtube.com/watch?v=${song.id}`,
            isAudioOnly: true,
            aFormat: 'mp3'
          })
        });

        const data = await response.json();

        if (data.url) {
          const a = document.createElement('a');
          a.href = data.url;
          a.download = `${song.title} - ${song.artist}.mp3`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          // Fallback jika API sedang sibuk: buka halaman converter bersih tanpa spasi URL
          window.open(`https://y2mate.nu/en-1/youtube-to-mp3?q=https://www.youtube.com/watch?v=${song.id}`, '_blank');
        }
      } else {
        alert('ID lagu tidak ditemukan.');
      }
    } catch (err) {
      console.error('Download error:', err);
      if (song.id) {
        window.open(`https://y2mate.nu/en-1/youtube-to-mp3?q=https://www.youtube.com/watch?v=${song.id}`, '_blank');
      } else {
        alert('Gagal mengunduh lagu.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Pilihan cepat</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 relative">
          {songs.map((song, index) => {
            const isMenuOpen = activeMenuId === song.id;
            const isDownloadingThisSong = downloadingId === song.id;

            return (
              <div
                key={song.id || index}
                onClick={() => onSelectSong(index, songs)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-900/90 transition duration-150 cursor-pointer group relative"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-neutral-900">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="truncate pr-2">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-neutral-200">
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleLike) onToggleLike(song);
                    }} 
                    className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
                    title="Sukai"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
                    title="Tidak Suka"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : song.id);
                      }} 
                      className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div 
                        ref={menuRef}
                        className="absolute right-0 top-10 w-56 bg-[#212121] border border-neutral-800 rounded-2xl shadow-2xl z-50 py-2 text-sm text-neutral-200 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => {
                            onGoToSearch(`${song.artist} mix`);
                            setActiveMenuId(null);
                          }} 
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                        >
                          <Radio className="w-4 h-4 text-neutral-300" />
                          <span>Mulai mix</span>
                        </button>

                        <button 
                          onClick={() => {
                            if (onPlayNext) onPlayNext(song);
                            setActiveMenuId(null);
                          }} 
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                        >
                          <PlaySquare className="w-4 h-4 text-neutral-300" />
                          <span>Putar setelah ini</span>
                        </button>

                        <button 
                          onClick={() => {
                            if (onAddToQueue) onAddToQueue(song);
                            setActiveMenuId(null);
                          }} 
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                        >
                          <ListPlus className="w-4 h-4 text-neutral-300" />
                          <span>Tambahkan ke antrean</span>
                        </button>

                        <button 
                          onClick={() => {
                            if (onToggleLike) onToggleLike(song);
                            setActiveMenuId(null);
                          }} 
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                        >
                          <Bookmark className="w-4 h-4 text-neutral-300" />
                          <span>Simpan ke koleksi</span>
                        </button>

                        <button 
                          onClick={(e) => handleDownloadSong(e, song)}
                          disabled={isDownloadingThisSong}
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 text-neutral-300" />
                          <span>{isDownloadingThisSong ? 'Memproses...' : 'Download'}</span>
                        </button>

                        <button 
                          onClick={() => {
                            if (onSaveToPlaylist) onSaveToPlaylist(song);
                            setActiveMenuId(null);
                          }} 
                          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
                        >
                          <FolderPlus className="w-4 h-4 text-neutral-300" />
                          <span>Simpan ke playlist</span>
                        </button>

                        <button 
                          onClick={() => {
                            onGoToSearch(`Album ${song.artist}`);
                            setActiveMenuId(null);
                          }} 
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
            );
          })}
        </div>
      </div>
    </div>
  );
};