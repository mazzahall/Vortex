import React, { useState } from 'react';
import type { Song } from '../types/music';
import { 
  MoreVertical, 
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

interface SongMenuProps {
  song: Song;
  onStartMix?: (song: Song) => void;
  onPlayNext?: (song: Song) => void;
  onAddToQueue?: (song: Song) => void;
  onSaveToLibrary?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  onOpenAlbum?: (song: Song) => void;
}

export const SongMenu: React.FC<SongMenuProps> = ({
  song,
  onStartMix,
  onPlayNext,
  onAddToQueue,
  onSaveToLibrary,
  onAddToPlaylist,
  onOpenAlbum,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsDownloading(true);

    try {
      let downloadUrl = song.audioUrl;

      if (!downloadUrl && song.id) {
        const invidiousInstances = [
          'https://inv.riverside.rocks',
          'https://invidious.nerdvpn.de',
          'https://invidious.drgns.space'
        ];

        for (const instance of invidiousInstances) {
          try {
            const res = await fetch(`${instance}/api/v1/videos/${song.id}`);
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
        a.download = `${song.title} - ${song.artist}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } else {
        alert('Gagal mengambil file audio lagu ini.');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Gagal mengunduh lagu.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
        title="Opsi Lainnya"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <div 
          className="absolute right-0 top-10 w-56 bg-[#212121] border border-neutral-800 rounded-2xl shadow-2xl z-50 py-2 text-sm text-neutral-200 font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => { setShowMenu(false); onStartMix?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <Radio className="w-4 h-4 text-neutral-300" />
            <span>Mulai mix</span>
          </button>

          <button 
            onClick={() => { setShowMenu(false); onPlayNext?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <PlaySquare className="w-4 h-4 text-neutral-300" />
            <span>Putar setelah ini</span>
          </button>

          <button 
            onClick={() => { setShowMenu(false); onAddToQueue?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <ListPlus className="w-4 h-4 text-neutral-300" />
            <span>Tambahkan ke antrean</span>
          </button>

          <button 
            onClick={() => { setShowMenu(false); onSaveToLibrary?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <Bookmark className="w-4 h-4 text-neutral-300" />
            <span>Simpan ke koleksi</span>
          </button>

          {/* Fitur Download di Menu Atas */}
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-neutral-300" />
            <span>{isDownloading ? 'Mengunduh...' : 'Download'}</span>
          </button>

          <button 
            onClick={() => { setShowMenu(false); onAddToPlaylist?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <FolderPlus className="w-4 h-4 text-neutral-300" />
            <span>Simpan ke playlist</span>
          </button>

          <button 
            onClick={() => { setShowMenu(false); onOpenAlbum?.(song); }} 
            className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-800 transition text-left"
          >
            <Disc className="w-4 h-4 text-neutral-300" />
            <span>Buka album</span>
          </button>
        </div>
      )}
    </div>
  );
};