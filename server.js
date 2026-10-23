cat << 'EOF' > server.js
import express from 'express';
import cors from 'cors';
import { exec } from 'yt-dlp-exec';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send('URL required');

  res.header('Content-Type', 'audio/mpeg');
  res.header('Content-Disposition', 'attachment; filename="audio.mp3"');

  const subprocess = exec(videoUrl, {
    extractAudio: true,
    audioFormat: 'mp3',
    output: '-'
  }, { stdio: ['ignore', 'pipe', 'ignore'] });

  subprocess.stdout.pipe(res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
EOF