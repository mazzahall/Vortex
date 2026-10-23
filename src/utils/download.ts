export const downloadSong = async (videoId: string): Promise<void> => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  // Hapus iframe lama jika ada
  const existingIframe = document.getElementById('hidden-download-frame');
  if (existingIframe) {
    document.body.removeChild(existingIframe);
  }

  // Buat iframe tersembunyi agar widget ter-load secara internal tanpa buka tab baru
  const iframe = document.createElement('iframe');
  iframe.id = 'hidden-download-frame';
  iframe.style.display = 'none';
  iframe.src = `https://vevioz.com/api/button/mp3/${videoId}`;

  document.body.appendChild(iframe);
};