from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    youtube_url = f"https://www.youtube.com/watch?v={video_id}"

    # Konfigurasi yt-dlp untuk ekstrak URL stream audio murni tanpa download file
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            stream_url = info.get('url')

            if stream_url:
                # Redirect langsung ke audio stream asli YouTube
                return redirect(stream_url, code=302)

    except Exception as e:
        print(f"yt-dlp Error: {e}")

    return jsonify({"error": "Gagal mengambil stream audio YouTube"}), 500

if __name__ == '__main__':
    app.run(port=4000)