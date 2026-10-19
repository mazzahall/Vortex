import React, { useState, useEffect, useRef } from 'react';
import type { Song, LyricLine } from '../types/music';
import { Music2 } from 'lucide-react';

interface LyricsViewProps {
  currentSong: Song | null;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

// Helper function dipindah ke luar komponen agar tidak kena hoisting error ESLint
const parseLrc = (lrc: string): LyricLine[] => {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = timeExp.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const time = minutes * 60 + seconds;
      const text = line.replace(timeExp, '').trim();
      if (text) result.push({ time, text });
    }
  }
  return result;
};

export const LyricsView: React.FC<LyricsViewProps> = ({ currentSong, currentTime, onSeek }) => {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const activeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!currentSong) return;

    const fetchLyrics = async () => {
      setLoading(true);
      setLyrics([]);
      try {
        const cleanTitle = currentSong.title.replace(/\(Official Audio\)|\(Official Video\)|[Official Audio]/gi, '').trim();
        const res = await fetch(`https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(currentSong.artist)}`);
        
        if (res.ok) {
          const data = await res.json();
          if (data.syncedLyrics) {
            const parsed = parseLrc(data.syncedLyrics);
            setLyrics(parsed);
          } else if (data.plainLyrics) {
            setLyrics([{ time: 0, text: data.plainLyrics }]);
          }
        }
      } catch (err) {
        console.warn('Lirik tidak ditemukan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime]);

  if (!currentSong) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <Music2 className="w-12 h-12 mb-2" />
        <p>Pilih lagu untuk melihat lirik real-time</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-8 bg-gradient-to-b from-violet-950/40 via-slate-900/50 to-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
      {/* Cover Side */}
      <div className="flex flex-col items-center text-center max-w-xs shrink-0">
        <div className="w-56 h-56 rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl mb-6 group">
          <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </div>
        <h2 className="text-xl font-bold text-white truncate max-w-full">{currentSong.title}</h2>
        <p className="text-sm text-violet-400 mt-1 truncate max-w-full">{currentSong.artist}</p>
      </div>

      {/* Synced Lyrics Scroll Area */}
      <div className="flex-1 w-full h-full overflow-y-auto space-y-6 text-center md:text-left pr-4 scrollbar-thin scrollbar-thumb-slate-800">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400">Mencari lirik...</div>
        ) : lyrics.length > 0 ? (
          lyrics.map((line, idx) => {
            const isCurrent = currentTime >= line.time && (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].time);
            return (
              <p
                key={idx}
                ref={isCurrent ? activeRef : null}
                onClick={() => line.time > 0 && onSeek(line.time)}
                className={`transition-all duration-300 cursor-pointer text-lg font-bold ${
                  isCurrent ? 'text-violet-400 scale-105 opacity-100 drop-shadow-[0_0_12px_rgba(167,139,250,0.5)]' : 'text-slate-500 hover:text-slate-300 opacity-50'
                }`}
              >
                {line.text}
              </p>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <p>Lirik tidak ditemukan untuk lagu ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};