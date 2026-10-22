from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Daftar instance Invidious publik sebagai cadangan jika salah satu offline
INVIDIOUS_INSTANCES = [
    "https://inv.projectsegfau.lt",
    "https://invidious.nerdvpn.de",
    "https://invidious.drgns.space"
]

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    # Cari audio stream URL lewat instance Invidious
    for instance in INVIDIOUS_INSTANCES:
        try:
            api_url = f"{instance}/api/v1/videos/{video_id}"
            response = requests.get(api_url, timeout=5)

            if response.status_code == 200:
                data = response.json()
                adaptive_formats = data.get('adaptiveFormats', [])

                # Filter khusus format audio saja
                audio_streams = [
                    f for f in adaptive_formats 
                    if f.get('type', '').startswith('audio/')
                ]

                if audio_streams:
                    # Ambil stream audio dengan kualitas terbaik
                    stream_url = audio_streams[0].get('url')
                    return redirect(stream_url, code=302)
        except Exception as e:
            print(f"Gagal konek ke {instance}: {e}")
            continue

    return jsonify({"error": "Gagal mengambil stream audio dari Invidious"}), 500

if __name__ == '__main__':
    app.run(port=4000)