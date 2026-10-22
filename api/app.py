from flask import Flask, request, jsonify, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    # Menggunakan endpoint konversi MP3 publik yang langsung siap di-download oleh browser
    direct_download_url = f"https://api.vevioz.com/api/button/mp3/{video_id}"
    
    return redirect(direct_download_url, code=302)

if __name__ == '__main__':
    app.run(port=4000)