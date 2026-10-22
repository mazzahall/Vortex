import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { LyricsView } from './components/LyricsView';
import Player from './components/Player';
import type { Song, Playlist, YTPlayer, YTEvent } from './types/music';
import { 
  Minimize2, 
  Trash2, 
  Search, 
  Cast, 
  LogOut, 
  LogIn,
  X
} from 'lucide-react';

import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import { AuthModal } from './components/AuthModal';
import { searchSongs, type SongResult } from './searchClient';

const MOOD_TAGS = [
  'Bersantai', 'Senang', 'Sedih', 'Romansa', 'Perjalanan', 'Mengisi energi', 'Pesta', 'Olahraga', 'Tidur'
];

const decodeHtml = (s: string) => {
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
};

const toSong = (r: SongResult): Song => ({
  id: r.id,
  title: decodeHtml(r.title),
  artist: decodeHtml(r.channel),
  cover: r.thumbnail || `https://i.ytimg.com/vi/${r.id}/hqdefault.jpg`,
});

export const SpotifyApp: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(() => JSON.parse(localStorage.getItem('vortex_songs') || '[]'));
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => JSON.parse(localStorage.getItem('vortex_liked') || '[]'));
  const [playlists, setPlaylists] = useState<Playlist[]>(() => JSON.parse(localStorage.getItem('vortex_playlists') || '[]'));
  const [history, setHistory] = useState<Song[]>(() => JSON.parse(localStorage.getItem('vortex_history') || '[]'));
  const [queue, setQueue] = useState<Song[]>([]);
  const [playedIds, setPlayedIds] = useState<string[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(true);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const currentSong = currentIndex >= 0 && songs[currentIndex] ? songs[currentIndex] : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem('vortex_songs', JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem('vortex_liked', JSON.stringify(likedSongs)); }, [likedSongs]);
  useEffect(() => { localStorage.setItem('vortex_playlists', JSON.stringify(playlists)); }, [playlists]);
  useEffect(() => { localStorage.setItem('vortex_history', JSON.stringify(history)); }, [history]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      const query = searchQuery.trim().toLowerCase();
      setSuggestions([
        `${query}`,
        `${query} lyrics`,
        `${query} dance`,
        `${query} mirror`,
        `${query} de aerosmith`,
        `masteran cendet ${query}`
      ]);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const playSong = useCallback((song: Song) => {
    setHistory((prev) => [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 20));
    setPlayedIds((prev) => Array.from(new Set([...prev, song.id])));

    setSongs((prev) => {
      const exists = prev.some((s) => s.id === song.id);
      const newSongs = exists ? prev : [song, ...prev];
      const newIndex = newSongs.findIndex((s) => s.id === song.id);
      setCurrentIndex(newIndex);
      return newSongs;
    });

    const triggerPlay = () => {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(song.id);
        if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
        if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(volume);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    };

    if (playerRef.current && isReadyRef.current) {
      triggerPlay();
    } else {
      setTimeout(triggerPlay, 300);
    }
  }, [volume]);

  const playSongById = useCallback((videoId: string) => {
    setPlayedIds((prev) => Array.from(new Set([...prev, videoId])));

    const triggerPlay = () => {
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(videoId);
        if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
        if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(volume);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    };

    if (playerRef.current && isReadyRef.current) {
      triggerPlay();
    } else {
      setTimeout(triggerPlay, 300);
    }
  }, [volume]);

  // LOGIKA SHUFFLE BENAR-BENAR RANDOM DENGAN OTOMATIS CARI LAGU BARU DARI YOUTUBE
  const handleNext = useCallback(async () => {
    // 1. Ambil dari antrean jika ada
    if (queue.length > 0) {
      const nextQueueSong = queue[0];
      setQueue((prev) => prev.slice(1));
      playSong(nextQueueSong);
      return;
    }

    if (repeatMode === 'one' && currentSong) {
      playSongById(currentSong.id);
      return;
    }

    // Gabungkan seluruh sumber lagu lokal
    const poolMap = new Map<string, Song>();
    songs.forEach((s) => poolMap.set(s.id, s));
    searchResults.forEach((s) => poolMap.set(s.id, s));
    history.forEach((s) => poolMap.set(s.id, s));

    const pool = Array.from(poolMap.values());
    // Cari lagu yang BELUM PERNAH diputar
    const unplayedSongs = pool.filter((s) => !playedIds.includes(s.id));

    if (unplayedSongs.length > 0) {
      // Pilih dari lagu lokal yang belum pernah didengar
      const randomIdx = Math.floor(Math.random() * unplayedSongs.length);
      playSong(unplayedSongs[randomIdx]);
    } else {
      // Jika lagu lokal sudah habis/pernah diputar semua, OTOMATIS CARI LAGU BARU KE YOUTUBE
      const queryKey = currentSong?.artist || MOOD_TAGS[Math.floor(Math.random() * MOOD_TAGS.length)];
      try {
        const fetchedResults = await searchSongs(`${queryKey} song`);
        const newSongs = fetchedResults.map(toSong).filter((s) => !playedIds.includes(s.id));

        if (newSongs.length > 0) {
          const pickedSong = newSongs[Math.floor(Math.random() * newSongs.length)];
          playSong(pickedSong);
        } else if (pool.length > 0) {
          // Reset riwayat jika benar-benar tidak ada lagu baru dari API
          const pickedSong = pool[Math.floor(Math.random() * pool.length)];
          setPlayedIds([pickedSong.id]);
          playSong(pickedSong);
        }
      } catch (err) {
        console.error('Gagal mengambil lagu baru untuk shuffle:', err);
        if (pool.length > 0) {
          const pickedSong = pool[Math.floor(Math.random() * pool.length)];
          playSong(pickedSong);
        }
      }
    }
  }, [queue, songs, searchResults, history, repeatMode, currentSong, playedIds, playSong, playSongById]);

  const handlePrev = useCallback(() => {
    if (!songs || songs.length === 0) return;

    const prevIdx = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    const targetSong = songs[prevIdx];
    if (targetSong) {
      setCurrentIndex(prevIdx);
      playSongById(targetSong.id);
    }
  }, [songs, currentIndex, playSongById]);

  useEffect(() => {
    const windowYT = window as unknown as { 
      YT?: { Player: new (id: string, config: unknown) => YTPlayer };
      onYouTubeIframeAPIReady?: () => void;
    };

    const initPlayer = () => {
      if (windowYT.YT && !playerRef.current) {
        playerRef.current = new windowYT.YT.Player('youtube-player', {
          height: '1',
          width: '1',
          videoId: '',
          playerVars: { 
            autoplay: 1, 
            controls: 0, 
            enablejsapi: 1, 
            origin: window.location.origin,
            playsinline: 1
          },
          events: {
            onReady: () => { 
              isReadyRef.current = true; 
            },
            onStateChange: (event: YTEvent) => {
              if (event.data === 0) handleNext();
              if (event.data === 1) setIsPlaying(true);
              if (event.data === 2) setIsPlaying(false);
            },
          },
        });
      }
    };

    if (!windowYT.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      windowYT.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, [handleNext]);

  const searchYouTube = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchFocused(false);
    setActiveTab('search');

    try {
      const results = await searchSongs(`${query} official audio`);
      const mapped = results.map(toSong);
      setSearchResults(mapped);

      setSongs((prev) => {
        const map = new Map<string, Song>();
        prev.forEach((s) => map.set(s.id, s));
        mapped.forEach((s) => map.set(s.id, s));
        return Array.from(map.values());
      });
    } catch (err) {
      console.error('Search gagal:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        if (typeof playerRef.current.getCurrentTime === 'function') {
          setCurrentTime(playerRef.current.getCurrentTime() || 0);
        }
        if (typeof playerRef.current.getDuration === 'function') {
          setDuration(playerRef.current.getDuration() || 0);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-black text-white font-sans antialiased select-none h-screen flex flex-col overflow-hidden relative">
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}>
        <div id="youtube-player"></div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          likedCount={likedSongs ? likedSongs.length : 0}
          playlists={playlists || []}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCreatePlaylist={(name) => setPlaylists((prev) => [...prev, { id: Date.now().toString(), name, songs: [] }])}
          onDeletePlaylist={(id) => setPlaylists((prev) => prev.filter((p) => p.id !== id))}
        />

        <main className="flex-1 bg-black overflow-y-auto relative flex flex-col">
          <header className="sticky top-0 bg-black/95 backdrop-blur-md px-8 py-4 flex items-center justify-between z-30 border-b border-neutral-900">
            <div ref={searchContainerRef} className="relative w-full max-w-lg">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-4 text-neutral-400 pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Telusuri lagu, album, artis, podcast"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchYouTube(searchQuery);
                    }
                  }}
                  className="w-full bg-neutral-900 border border-transparent focus:border-neutral-700 rounded-full pl-11 pr-10 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-3.5 text-neutral-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-fade-in">
                  <div className="py-1">
                    {suggestions.map((text, idx) => (
                      <div
                        key={`sug-${idx}`}
                        onClick={() => {
                          setSearchQuery(text);
                          searchYouTube(text);
                        }}
                        className="flex items-center gap-4 px-5 py-2.5 hover:bg-neutral-800/80 cursor-pointer text-sm text-neutral-300 hover:text-white transition"
                      >
                        <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-900">
                <Cast className="w-5 h-5" />
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      user.email?.[0].toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={() => signOut(auth)}
                    className="p-2 text-neutral-400 hover:text-red-400 rounded-full hover:bg-neutral-900"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-black font-semibold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Masuk
                </button>
              )}
            </div>
          </header>

          <div className="p-8 pt-4 flex-1 flex flex-col">
            {activeTab === 'home' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                {MOOD_TAGS.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTag = isSelected ? null : tag;
                        setSelectedTag(newTag);
                        if (newTag) {
                          searchYouTube(newTag);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition border ${
                        isSelected 
                          ? 'bg-white text-black border-white' 
                          : 'bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'home' && (
              <HomeView 
                songs={songs} 
                history={history}
                onSelectSong={(idx, list) => {
                  const targetList = list || songs;
                  const song = targetList[idx];
                  if (song) playSong(song);
                }}
                onGoToSearch={(q) => {
                  if (q) searchYouTube(q);
                }}
                onPlayNext={(s) => setQueue((prev) => [s, ...prev])}
                onAddToQueue={(s) => setQueue((prev) => [...prev, s])}
                onToggleLike={(s) => setLikedSongs((prev) => prev.some((x) => x.id === s.id) ? prev.filter((x) => x.id !== s.id) : [...prev, s])}
              />
            )}

            {activeTab === 'search' && (
              <SearchView 
                searchResults={searchResults}
                onPlaySong={playSong}
                onAddToQueue={(s) => setQueue((prev) => [...prev, s])}
              />
            )}

            {activeTab === 'liked' && (
              <HomeView 
                songs={likedSongs}
                history={[]}
                onSelectSong={(idx) => {
                  if (likedSongs[idx]) playSong(likedSongs[idx]);
                }}
                onGoToSearch={(q) => {
                  if (q) searchYouTube(q);
                }}
              />
            )}

            {activeTab === 'lyrics' && (
              <LyricsView 
                currentSong={currentSong} 
                currentTime={currentTime}
                onSeek={(sec) => {
                  if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                    playerRef.current.seekTo(sec, true);
                    setCurrentTime(sec);
                  }
                }}
              />
            )}
          </div>
        </main>

        {showQueue && (
          <aside className="w-72 bg-neutral-900 border-l border-neutral-800 p-4 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-white border-b border-neutral-800 pb-2">Antrean Lagu ({queue.length})</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {queue.map((s, i) => (
                <div key={`q-${s.id}-${i}`} className="flex items-center justify-between p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <img src={s.cover} alt={s.title} className="w-8 h-8 rounded object-cover" />
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate">{s.title}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{s.artist}</p>
                    </div>
                  </div>
                  <button onClick={() => setQueue((prev) => prev.filter((_, idx) => idx !== i))} className="text-neutral-500 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {isFullscreen && currentSong && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-fade-in">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-white p-2">
            <Minimize2 className="w-8 h-8" />
          </button>
          <img src={currentSong.cover} alt={currentSong.title} className="w-80 h-80 rounded-2xl shadow-2xl border border-neutral-800 mb-8" />
          <h1 className="text-3xl font-extrabold text-white mb-2">{currentSong.title}</h1>
          <p className="text-neutral-400 font-medium text-lg mb-8">{currentSong.artist}</p>
        </div>
      )}

      {currentSong && (
        <Player 
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          isLiked={currentSong ? likedSongs.some((s) => s.id === currentSong.id) : false}
          showLyrics={activeTab === 'lyrics'}
          showQueue={showQueue}
          onTogglePlayPause={() => {
            if (!playerRef.current) return;
            if (isPlaying) { 
              playerRef.current.pauseVideo(); 
              setIsPlaying(false); 
            } else { 
              if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
              playerRef.current.playVideo(); 
              setIsPlaying(true); 
            }
          }}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={(sec: number) => {
            if (playerRef.current) { playerRef.current.seekTo(sec, true); setCurrentTime(sec); }
          }}
          onVolumeChange={(v: number) => { 
            setVolume(v); 
            if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
              playerRef.current.setVolume(v); 
            }
          }}
          onToggleMute={() => {
            if (!playerRef.current) return;
            if (isMuted) { playerRef.current.unMute(); setIsMuted(false); }
            else { playerRef.current.mute(); setIsMuted(true); }
          }}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          onToggleRepeat={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
          onToggleLike={(s: Song) => setLikedSongs((prev) => prev.some((x) => x.id === s.id) ? prev.filter((x) => x.id !== s.id) : [...prev, s])}
          onToggleLyrics={() => setActiveTab(activeTab === 'lyrics' ? 'home' : 'lyrics')}
          onToggleQueue={() => setShowQueue(!showQueue)}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};