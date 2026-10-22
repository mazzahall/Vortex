import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Heart, 
  Clock, 
  Music2, 
  Plus, 
  Trash2, 
  Library,
  ListMusic
} from 'lucide-react';
import type { Playlist } from '../types/music';

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
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="w-64 bg-black border-r border-neutral-900 flex flex-col justify-between select-none h-full p-4 gap-6">
      <div className="flex flex-col gap-6">
        {/* Logo / Brand Name */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">VORTEX</span>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === 'home'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Utama</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === 'search'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Telusuri</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === 'liked'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
            <div className="flex items-center justify-between flex-1">
              <span>Lagu Disukai</span>
              {likedCount > 0 && (
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                  {likedCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === 'history'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Clock className="w-5 h-5 text-neutral-400" />
            <span>Riwayat Putar</span>
          </button>

          <button
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
              activeTab === 'lyrics'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <ListMusic className="w-5 h-5" />
            <span>Lirik Lagu</span>
          </button>
        </nav>

        {/* Bagian Playlist */}
        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-900">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <Library className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Koleksi Playlist</span>
            </div>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="p-1 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded-lg transition"
              title="Buat Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Form Buat Playlist Baru */}
          {isCreating && (
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                placeholder="Nama playlist..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
              />
            </form>
          )}

          {/* Daftar Playlist */}
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none">
            {playlists.length === 0 ? (
              <p className="text-xs text-neutral-600 italic px-2 py-1">Belum ada playlist</p>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-900/80 cursor-pointer text-xs text-neutral-400 hover:text-white transition"
                >
                  <span className="truncate">{pl.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlaylist(pl.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};