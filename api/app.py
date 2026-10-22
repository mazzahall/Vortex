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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://y2mate.nu/"
    }

    try:
        # Step 1: Request konversi MP3 ke server Y2Mate
        init_url = f"https://y2mate.nu/api/v1/init?v={video_id}&f=mp3"
        init_res = requests.get(init_url, headers=headers, timeout=6)
        
        if init_res.status_code == 200:
            data = init_res.json()
            convert_url = data.get("convertURL")
            
            if convert_url:
                # Step 2: Dapatkan direct link download MP3
                conv_res = requests.get(convert_url, headers=headers, timeout=8)
                if conv_res.status_code == 200:
                    conv_data = conv_res.json()
                    download_url = conv_data.get("downloadURL")
                    if download_url:
                        return redirect(download_url, code=302)

    except Exception as e:
        print(f"Y2Mate error: {e}")

    # Fallback jika server konversi sibuk
    fallback_download = f"https://loader.to/api/ajax/download.php?start=1&end=1&format=mp3&url=https://www.youtube.com/watch?v={video_id}"
    try:
        f_res = requests.get(fallback_download, headers=headers, timeout=5).json()
        if f_res.get("download_url"):
            return redirect(f_res.get("download_url"), code=302)
    except Exception as e:
        print(f"Fallback error: {e}")

    return jsonify({"error": "Gagal mengunduh audio, coba beberapa saat lagi."}), 500

if __name__ == '__main__':
    app.run(port=4000)