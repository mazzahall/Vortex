export const downloadSong = (videoId: string, title: string) => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  // Membersihkan karakter terlarang & melakukan encode judul
  const rawCleanTitle = title.replace(/[\\/*?:"<>|]/g, '').trim() || 'music';
  const cleanTitle = encodeURIComponent(rawCleanTitle);

  // Mengarahkan ke serverless API di Vercel
  const downloadUrl = `/api/download?videoId=${videoId}&title=${cleanTitle}`;

  // Trigger download otomatis di browser
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.setAttribute('download', `${rawCleanTitle}.mp3`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};