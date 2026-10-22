export const downloadSong = (videoId: string, title: string) => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const rawCleanTitle = title ? title.replace(/[\\/*?:"<>|]/g, '').trim() : 'music';
  const cleanTitle = encodeURIComponent(rawCleanTitle);

  // Arahkan browser langsung ke API Vercel
  const downloadUrl = `/api/download?videoId=${videoId}&title=${cleanTitle}`;

  // Buka URL di tab baru agar browser menangani aliran audio/download dari YouTube
  window.open(downloadUrl, '_blank');
};