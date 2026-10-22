from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    youtube_url = f"https://www.youtube.com/watch?v={video_id}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        # Step 1: Inisialisasi permintaan konversi MP3 ke Loader.to
        init_url = f"https://loader.to/api/ajax/download.php?format=mp3&url={youtube_url}"
        response = requests.get(init_url, headers=headers, timeout=8)
        
        if response.status_code == 200:
            data = response.json()
            job_id = data.get("id")

            if job_id:
                # Step 2: Cek status konversi (polling) sampai file MP3 siap
                for _ in range(10):
                    time.sleep(1)
                    progress_url = f"https://loader.to/api/ajax/progress.php?id={job_id}"
                    prog_res = requests.get(progress_url, headers=headers, timeout=5)
                    
                    if prog_res.status_code == 200:
                        prog_data = prog_res.json()
                        # Jika proses selesai (progress 1000 = 100%), ambil URL download
                        if prog_data.get("download_url"):
                            return redirect(prog_data.get("download_url"), code=302)

    except Exception as e:
        print(f"Loader.to Error: {e}")

    return jsonify({"error": "Gagal memproses konversi MP3. Silakan coba lagi."}), 500

if __name__ == '__main__':
    app.run(port=4000)