export const downloadSong = (videoId: string, title: string) => {
  if (!videoId) {
    alert('ID lagu tidak ditemukan.');
    return;
  }

  const cleanTitle = title ? encodeURIComponent(title) : 'music';
  
  // Mengarahkan ke server Python di port 4000
  const downloadUrl = `/api/download?videoId=${videoId}&title=${encodeURIComponent(title)}`;

  // Trigger download otomatis di browser
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.setAttribute('download', `${title}.mp3`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};