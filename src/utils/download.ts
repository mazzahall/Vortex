export const downloadSong = async (videoId: string, title?: string): Promise<void> => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const rawCleanTitle = title ? title.replace(/[\\/*?:"<>|]/g, '').trim() : 'music';
  const cleanTitle = encodeURIComponent(rawCleanTitle);

  try {
    // 1. Request file MP3 langsung ke API backend
    const response = await fetch(`/api/download?videoId=${videoId}&title=${cleanTitle}`);

    if (!response.ok) {
      throw new Error('Gagal mengunduh file audio dari server.');
    }

    // 2. Ubah data stream audio menjadi Blob file
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 3. Picu trigger pemicu download otomatis browser
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${rawCleanTitle}.mp3`;
    document.body.appendChild(link);
    link.click();

    // 4. Bersihkan memori elemen temporary
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('Download error:', error);
    alert('Gagal mengunduh lagu secara langsung. Coba lagi dalam beberapa saat.');
  }
};