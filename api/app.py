from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Daftar instance Invidious publik yang lebih stabil & aktif
INVIDIOUS_INSTANCES = [
    "https://inv.us.projectsegfau.lt",
    "https://invidious.flokinet.to",
    "https://invidious.privacydev.net",
    "https://inv.tux.im",
    "https://invidious.no-commercial.pro"
]

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    for instance in INVIDIOUS_INSTANCES:
        try:
            api_url = f"{instance}/api/v1/videos/{video_id}"
            response = requests.get(api_url, headers=headers, timeout=5)

            if response.status_code == 200:
                data = response.json()
                adaptive_formats = data.get('adaptiveFormats', [])

                # Filter khusus stream audio
                audio_streams = [
                    f for f in adaptive_formats 
                    if f.get('type', '').startswith('audio/')
                ]

                if audio_streams:
                    # Urutkan berdasarkan bitrate tertinggi
                    audio_streams.sort(key=lambda x: int(x.get('bitrate', 0)), reverse=True)
                    stream_url = audio_streams[0].get('url')
                    return redirect(stream_url, code=302)
        except Exception as e:
            print(f"Gagal konek ke {instance}: {e}")
            continue

    return jsonify({"error": "Semua instance Invidious gagal merespons, coba beberapa saat lagi"}), 500

if __name__ == '__main__':
    app.run(port=4000)