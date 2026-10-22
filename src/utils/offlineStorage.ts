import type { Song } from '../types/music';

const DB_NAME = 'MusicAppOfflineDB';
const STORE_NAME = 'downloaded_songs';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveSongOffline = async (song: Song, audioBlob: Blob) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      cover: song.cover,
      blob: audioBlob,
      downloadedAt: Date.now(),
    };

    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const isSongDownloaded = async (id: string): Promise<boolean> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => resolve(false);
  });
};

export const getOfflineAudioUrl = async (id: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      if (request.result && request.result.blob) {
        const url = URL.createObjectURL(request.result.blob);
        resolve(url);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => resolve(null);
  });
};