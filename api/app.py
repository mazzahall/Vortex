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

    # API Ytmp3 / Yt1s Public Direct Engine
    apis = [
        f"https://api.ytmp3.nu/download/{video_id}",
        f"https://ytstream.online/api/download?id={video_id}",
        f"https://convert2mp3.tv/api/widget?url=https://www.youtube.com/watch?v={video_id}"
    ]

    for api_endpoint in apis:
        try:
            res = requests.get(api_endpoint, headers=headers, timeout=5)
            if res.status_code == 200:
                # Jika response langsung mengembalikan URL atau redirect
                return redirect(api_endpoint, code=302)
        except Exception as e:
            print(f"API Error: {e}")
            continue

    # Fallback ke direct audio proxy universal
    fallback_url = f"https://api.vibe.sh/download/{video_id}"
    return redirect(fallback_url, code=302)

if __name__ == '__main__':
    app.run(port=4000)