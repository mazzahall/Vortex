import React, { useState } from 'react';
import type { Playlist } from '../types/music';
import { 
  Home, 
  Search, 
  Heart, 
  Plus, 
  Trash2, 
  PanelLeft, 
  ListMusic 
} from 'lucide-react';

interface SidebarProps {
  likedCount: number;
  playlists: Playlist[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  likedCount,
  playlists,
  activeTab,
  setActiveTab,
  onCreatePlaylist,
  onDeletePlaylist,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowInput(false);
    }
  };

  return (
    <aside
      className={`bg-black border-r border-neutral-900 h-full flex flex-col justify-between transition-all duration-300 p-4 select-none ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="space-y-6">
        {/* Header Logo & Tombol Toggle Expand/Collapse (Ikon PanelLeft) */}
        <div className="flex items-center gap-3 px-2 py-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition flex-shrink-0"
            title={isExpanded ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          {isExpanded && (
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 flex-shrink-0">
                <ListMusic className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h1 className="text-base font-extrabold text-white tracking-wider">VORTEX</h1>
              </div>
            </div>
          )}
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl font-medium text-sm transition ${
              activeTab === 'home'
                ? 'bg-neutral-800/90 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            } ${!isExpanded ? 'justify-center' : ''}`}
            title="Beranda"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="truncate">Beranda</span>}
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl font-medium text-sm transition ${
              activeTab === 'search'
                ? 'bg-neutral-800/90 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            } ${!isExpanded ? 'justify-center' : ''}`}
            title="Jelajah Musik"
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="truncate">Jelajah Musik</span>}
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl font-medium text-sm transition ${
              activeTab === 'liked'
                ? 'bg-neutral-800/90 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            } ${!isExpanded ? 'justify-center' : ''}`}
            title="Lagu Disukai"
          >
            <Heart className="w-5 h-5 flex-shrink-0 text-pink-500" />
            {isExpanded && (
              <span className="truncate">Lagu Disukai ({likedCount})</span>
            )}
          </button>
        </nav>

        {/* Section Playlist Kamu */}
        <div className="pt-4 border-t border-neutral-900 space-y-3">
          <div className={`flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
            {isExpanded && (
              <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
                Playlist Kamu
              </span>
            )}
            <button
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
                setShowInput(!showInput);
              }}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition"
              title="Buat Playlist Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showInput && isExpanded && (
            <form onSubmit={handleCreatePlaylist} className="px-1">
              <input
                type="text"
                placeholder="Nama playlist..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
                className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500/50"
              />
            </form>
          )}

          {/* Daftar Playlist */}
          {isExpanded && (
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-none">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="flex items-center justify-between group px-3 py-2 rounded-xl hover:bg-neutral-900/60 transition cursor-pointer text-xs text-neutral-300 hover:text-white"
                >
                  <span className="truncate font-medium">{pl.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlaylist(pl.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 transition"
                    title="Hapus Playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};