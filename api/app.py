from flask import Flask, request, jsonify, Response
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

    # Gunakan endpoint stream public Piped API
    piped_instances = [
        "https://pipedapi.kavin.rocks",
        "https://api.piped.privacydev.net",
        "https://pipedapi.mha.fi"
    ]

    for instance in piped_instances:
        try:
            api_url = f"{instance}/streams/{video_id}"
            res = requests.get(api_url, headers=headers, timeout=5)
            
            if res.status_code == 200:
                data = res.json()
                audio_streams = data.get('audioStreams', [])
                
                if audio_streams:
                    # Urutkan berdasarkan bitrate tertinggi
                    audio_streams.sort(key=lambda x: x.get('bitrate', 0), reverse=True)
                    audio_url = audio_streams[0].get('url')

                    # Stream audio secara langsung melalui Flask untuk menghindari 404 cache
                    req = requests.get(audio_url, stream=True, headers=headers)
                    
                    response = Response(
                        req.iter_content(chunk_size=1024 * 8),
                        content_type=req.headers.get('content-type', 'audio/mpeg')
                    )
                    response.headers['Content-Disposition'] = f'attachment; filename="{video_id}.mp3"'
                    # Nonaktifkan cache browser
                    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                    return response

        except Exception as e:
            print(f"Error pada instance {instance}: {e}")
            continue

    return jsonify({"error": "Gagal memproses stream audio. Silakan coba lagi."}), 500

if __name__ == '__main__':
    app.run(port=4000)