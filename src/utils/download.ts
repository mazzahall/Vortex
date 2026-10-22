export const downloadSong = async (videoId: string, title?: string): Promise<void> => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const rawCleanTitle = title ? title.replace(/[\\/*?:"<>|]/g, '').trim() : 'music';
  const cleanTitle = encodeURIComponent(rawCleanTitle);

  try {
    const response = await fetch(`/api/download?videoId=${videoId}&title=${cleanTitle}`);
    const data: { downloadWidget?: string; error?: string } = await response.json();

    if (data.downloadWidget) {
      // Buka widget konversi langsung di tab baru
      window.open(data.downloadWidget, '_blank');
    } else {
      alert(data.error || 'Gagal mendapatkan link download.');
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Terjadi kesalahan saat memproses unduhan.');
  }
};