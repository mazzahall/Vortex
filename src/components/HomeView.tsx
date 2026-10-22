import React from 'react';
import { Play, Plus, ListPlus, Heart } from 'lucide-react';
import type { Song } from '../types/music';

interface HomeViewProps {
  songs: Song[];
  history: Song[];
  onSelectSong: (index: number, list?: Song[]) => void;
  onGoToSearch: (query: string) => void;
  onPlayNext?: (song: Song) => void;
  onAddToQueue?: (song: Song) => void;
  onToggleLike?: (song: Song) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  songs,
  history,
  onSelectSong,
  onGoToSearch,
  onPlayNext,
  onAddToQueue,
  onToggleLike,
}) => {
  // Pilihan Cepat mengambil langsung dari history atau daftar songs utama
  const quickPicks = history.length > 0 ? history : songs;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Bagian Pilihan Cepat (Quick Picks) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Pilihan Cepat</h2>
        </div>

        {quickPicks.length === 0 ? (
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-8 text-center">
            <p className="text-neutral-400 text-sm">Belum ada lagu di Pilihan Cepat.</p>
            <button
              onClick={() => onGoToSearch('lagu populer')}
              className="mt-3 text-xs text-red-500 font-semibold hover:underline"
            >
              Cari lagu favorit kamu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickPicks.map((song, idx) => (
              <div
                key={`qp-${song.id}-${idx}`}
                onClick={() => onSelectSong(idx, quickPicks)}
                className="group relative bg-neutral-900/60 hover:bg-neutral-800/80 p-3 rounded-2xl border border-neutral-800/60 cursor-pointer transition flex flex-col"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate group-hover:text-red-400 transition">
                    {song.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
                </div>

                {/* Akses Cepat Opsional */}
                <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-neutral-800/40 opacity-0 group-hover:opacity-100 transition">
                  {onToggleLike && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(song);
                      }}
                      className="p-1 text-neutral-400 hover:text-white transition"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onPlayNext && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayNext(song);
                      }}
                      className="p-1 text-neutral-400 hover:text-white transition"
                      title="Putar Berikutnya"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onAddToQueue && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToQueue(song);
                      }}
                      className="p-1 text-neutral-400 hover:text-white transition"
                      title="Tambah ke Antrean"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};