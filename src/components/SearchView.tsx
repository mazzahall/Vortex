import React, { useState, useRef, useEffect } from 'react';
import type { Song } from '../types/music';
import { 
  Play, 
  ThumbsUp, 
  ThumbsDown, 
  MoreVertical, 
  Music,
  Radio,
  PlaySquare,
  ListPlus,
  Bookmark,
  Download,
  FolderPlus,
  Disc 
} from 'lucide-react';

interface SearchViewProps {
  searchResults: Song[];
  onPlaySong: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchResults,
  onPlaySong,
  onAddToQueue,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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

  return (
    <div className="space-y-6">
      {searchResults.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Hasil Pencarian</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
            {searchResults.map((song) => {
              const isMenuOpen = activeMenuId === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
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
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()} 
                      className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
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
                          <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <Radio className="w-4 h-4 text-neutral-300" />
                            <span>Mulai mix</span>
                          </button>
                          <button onClick={() => { onAddToQueue(song); setActiveMenuId(null); }} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <PlaySquare className="w-4 h-4 text-neutral-300" />
                            <span>Putar setelah ini</span>
                          </button>
                          <button onClick={() => { onAddToQueue(song); setActiveMenuId(null); }} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <ListPlus className="w-4 h-4 text-neutral-300" />
                            <span>Tambahkan ke antrean</span>
                          </button>
                          <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <Bookmark className="w-4 h-4 text-neutral-300" />
                            <span>Simpan ke koleksi</span>
                          </button>
                          <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <Download className="w-4 h-4 text-neutral-300" />
                            <span>Download</span>
                          </button>
                          <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
                            <FolderPlus className="w-4 h-4 text-neutral-300" />
                            <span>Simpan ke playlist</span>
                          </button>
                          <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <Music className="w-12 h-12 mb-3 stroke-[1.5]" />
          <p className="text-sm font-medium">Ketik lagu di kolom pencarian di atas lalu tekan Enter</p>
        </div>
      )}
    </div>
  );
};