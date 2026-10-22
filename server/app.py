from flask import Flask, request, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import os
import re
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')
    title = request.args.get('title', 'music')

    if not video_id:
        return "Video ID dibutuhkan", 400

    # Bersihkan nama file dari karakter terlarang Windows
    clean_title = re.sub(r'[\\/*?:"<>|]', '', title).strip() or "music"
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    
    # Lokasi folder server (tempat ffmpeg.exe berada)
    server_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Simpan file sementara di Folder Temp Windows (bukan di folder server)
    temp_dir = tempfile.gettempdir()
    temp_filename = f"song_{video_id}"
    temp_path = os.path.join(temp_dir, temp_filename)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': temp_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'ffmpeg_location': server_dir,
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        file_location = f"{temp_path}.mp3"

        if not os.path.exists(file_location):
            return "File MP3 tidak ditemukan setelah konversi", 500

        # Hapus file otomatis setelah terunduh di browser
        @after_this_request
        def remove_file(response):
            try:
                if os.path.exists(file_location):
                    os.remove(file_location)
            except Exception as e:
                print("Error hapus file temp:", e)
            return response

        return send_file(
            file_location,
            as_attachment=True,
            download_name=f"{clean_title}.mp3",
            mimetype='audio/mpeg'
        )

    except Exception as e:
        print("Error detail:", e)
        return f"Gagal memproses lagu: {str(e)}", 500

if __name__ == '__main__':
    print("Server Python berjalan di http://localhost:4000")
    app.run(port=4000)