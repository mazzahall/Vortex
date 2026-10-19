export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl?: string;
  album?: string;
  year?: string;
  duration?: number;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface YTPlayer {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
}

export interface YTEvent {
  data: number;
}