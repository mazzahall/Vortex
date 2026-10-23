from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    # Kumpulan Endpoint Direct MP3 Stream
    try:
        # Pilihan 1: Direct MP3 Stream API (Langsung pemicu download di browser)
        direct_url = f"https://ytstream-download-api.vercel.app/api/download?id={video_id}"
        res = requests.head(direct_url, headers=headers, timeout=5)
        if res.status_code < 400:
            return redirect(direct_url, code=302)
    except Exception as e:
        print(f"Primary direct stream error: {e}")

    try:
        # Pilihan 2: Fallback Direct Audio Endpoint
        backup_url = f"https://api.download-mp3.net/api/v1/download?id={video_id}"
        return redirect(backup_url, code=302)
    except Exception as e:
        print(f"Backup direct stream error: {e}")

    # Pilihan 3: Direct CDN Stream Fallback
    cdn_fallback = f"https://y2mate.is/api/v1/download?v={video_id}&f=mp3"
    return redirect(cdn_fallback, code=302)

if __name__ == '__main__':
    app.run(port=4000)