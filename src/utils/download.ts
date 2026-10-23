export const downloadSong = async (videoId: string, title?: string): Promise<void> => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const rawCleanTitle = title ? title.replace(/[\\/*?:"<>|]/g, '').trim() : 'music';

  try {
    // 1. Minta Direct Audio Stream URL dari API konversi client-side
    const apiUrl = `https://api.vevioz.com/api/button/mp3/${videoId}`;
    
    // 2. Jika ingin langsung terunduh secara internal di background:
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil stream audio.');
    }

    // 3. Ubah stream audio dari API menjadi Blob
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // 4. Picu dialog download bawaan browser secara otomatis
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${rawCleanTitle}.mp3`;
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup memori
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: Jika CORS memblokir Fetch Blob, gunakan elemen pemicu direct-click
    const directFallbackUrl = `https://api.vevioz.com/api/button/mp3/${videoId}`;
    const a = document.createElement('a');
    a.href = directFallbackUrl;
    a.download = `${rawCleanTitle}.mp3`;
    a.target = '_self'; // Tetap di halaman/aplikasi yang sama
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};