export interface SongResult {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export async function searchSongs(query: string): Promise<SongResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Search gagal (${res.status})`);
  }
  return res.json();
}