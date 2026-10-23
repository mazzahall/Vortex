import os
import tempfile
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
# Izinkan CORS dari frontend Vercel kamu
CORS(app)

@app.route('/api/download-mp3', methods=['GET'])
def download_mp3():
    video_id = request.args.get('videoId')
    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    url = f"https://www.youtube.com/watch?v={video_id}"
    
    # Simpan file sementara di direktori temp OS
    temp_dir = tempfile.gettempdir()
    output_template = os.path.join(temp_dir, f"{video_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_template,
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        mp3_file = os.path.join(temp_dir, f"{video_id}.mp3")
        
        if not os.path.exists(mp3_file):
            return jsonify({"error": "Gagal memproses file MP3"}), 500

        return send_file(
            mp3_file, 
            as_attachment=True, 
            download_name=f"{video_id}.mp3",
            mimetype="audio/mpeg"
        )
    except Exception as e:
        print(f"Error converting video {video_id}: {str(e)}")
        return jsonify({"error": f"Konversi gagal: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)