from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Daftar instance Piped API publik yang aktif
PIPED_INSTANCES = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.privacydev.net",
    "https://pipedapi.mha.fi",
    "https://pipedapi.adminforge.de",
    "https://piped-api.garudalinux.org"
]

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    # 1. Coba ambil audio stream dari daftar Piped API
    for instance in PIPED_INSTANCES:
        try:
            api_url = f"{instance}/streams/{video_id}"
            response = requests.get(api_url, headers=headers, timeout=5)

            if response.status_code == 200:
                data = response.json()
                audio_streams = data.get('audioStreams', [])

                if audio_streams:
                    # Sort untuk mendapatkan bitrate tertinggi (kualitas suara terbaik)
                    audio_streams.sort(key=lambda x: x.get('bitrate', 0), reverse=True)
                    stream_url = audio_streams[0].get('url')
                    if stream_url:
                        return redirect(stream_url, code=302)
        except Exception as e:
            print(f"Gagal konek ke {instance}: {e}")
            continue

    # 2. Fallback jika Piped publik semuanya bermasalah
    try:
        direct_proxy = f"https://yt-stream-api.vercel.app/api/stream?id={video_id}"
        return redirect(direct_proxy, code=302)
    except Exception as e:
        print(f"Fallback Proxy Error: {e}")

    return jsonify({"error": "Gagal mengambil stream audio. Coba lagi nanti."}), 500

if __name__ == '__main__':
    app.run(port=4000)