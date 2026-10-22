from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Instance Piped & Invidious aktif sebagai cadangan
STREAM_INSTANCES = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.privacydev.net",
    "https://pipedapi.mha.fi",
    "https://inv.us.projectsegfau.lt"
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

    for instance in STREAM_INSTANCES:
        try:
            # 1. Coba via Piped API
            if "piped" in instance:
                api_url = f"{instance}/streams/{video_id}"
                res = requests.get(api_url, headers=headers, timeout=4)
                if res.status_code == 200:
                    data = res.json()
                    audio_streams = data.get('audioStreams', [])
                    if audio_streams:
                        # Ambil stream audio dengan kualitas/bitrate terbaik
                        audio_streams.sort(key=lambda x: x.get('bitrate', 0), reverse=True)
                        return redirect(audio_streams[0].get('url'), code=302)

            # 2. Fallback ke Invidious API
            else:
                api_url = f"{instance}/api/v1/videos/{video_id}"
                res = requests.get(api_url, headers=headers, timeout=4)
                if res.status_code == 200:
                    data = res.json()
                    adaptive_formats = data.get('adaptiveFormats', [])
                    audio_streams = [f for f in adaptive_formats if f.get('type', '').startswith('audio/')]
                    if audio_streams:
                        audio_streams.sort(key=lambda x: int(x.get('bitrate', 0)), reverse=True)
                        return redirect(audio_streams[0].get('url'), code=302)

        except Exception as e:
            print(f"Gagal konek ke {instance}: {e}")
            continue

    return jsonify({"error": "Semua endpoint server gagal merespons. Coba lagi nanti."}), 500

if __name__ == '__main__':
    app.run(port=4000)