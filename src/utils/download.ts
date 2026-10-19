export const downloadSong = async (videoId: string, title: string) => {
  try {
    // Memanggil API Cobalt untuk mengambil link langsung stream MP3
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        isAudioOnly: true,
        aFormat: 'mp3'
      })
    });

    const data = await response.json();

    if (data.url) {
      // Buat elemen link virtual untuk memicu download browser
      const a = document.createElement('a');
      a.href = data.url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Gagal mengambil file audio, silakan coba lagi.');
    }
  } catch (error) {
    console.error('Error downloading song:', error);
    alert('Terjadi kesalahan saat mengunduh lagu.');
  }
};