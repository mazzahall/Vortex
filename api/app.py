from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import yt_dlp
import re

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')
    title = request.args.get('title', 'music')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    clean_title = re.sub(r'[\\/*?:"<>|]', '', title).strip() or "music"
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    # Konfigurasi yt-dlp tanpa ffmpeg (ambil direct stream audio)
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            stream_url = info.get('url')

            if not stream_url:
                return jsonify({"error": "Gagal mengambil stream URL"}), 500

            # Direct redirect ke URL audio stream YouTube (cepat & tanpa ffmpeg)
            return redirect(stream_url)

    except Exception as e:
        print("Error detail:", e)
        return jsonify({"error": f"Gagal memproses lagu: {str(e)}"}), 500

if __name__ == '__main__':
    print("Server Python berjalan di http://localhost:4000")
    app.run(port=4000)