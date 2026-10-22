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

    # 1. Coba pake API Converter Vevioz (paling responsif tanpa blokir IP cloud)
    try:
        vevioz_url = f"https://api.vevioz.com/api/button/mp3/{video_id}"
        res = requests.get(vevioz_url, headers=headers, timeout=5)
        if res.status_code == 200:
            return redirect(vevioz_url, code=302)
    except Exception as e:
        print(f"Vevioz API error: {e}")

    # 2. Backup API 2: Y2Mate Direct Endpoint
    try:
        y2mate_url = f"https://www.y2mate.com/youtube/{video_id}"
        return redirect(y2mate_url, code=302)
    except Exception as e:
        print(f"Backup API error: {e}")

    return jsonify({"error": "Gagal memproses stream audio."}), 500

if __name__ == '__main__':
    app.run(port=4000)