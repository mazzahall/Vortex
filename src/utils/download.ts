export const downloadSong = async (videoId: string, title?: string): Promise<void> => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const rawCleanTitle = title ? title.replace(/[\\/*?:"<>|]/g, '').trim() : 'music';

  try {
    // Memakai endpoint direct download stream
    const downloadUrl = `https://api.vevioz.com/api/button/mp3/${videoId}`;

    // Buat elemen link tersembunyi untuk mentrigger download bawaan browser
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${rawCleanTitle}.mp3`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    alert('Gagal memproses unduhan.');
  }
};