from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/download', methods=['GET'])
@app.route('/download', methods=['GET'])
def download():
    video_id = request.args.get('videoId')

    if not video_id:
        return jsonify({"error": "Video ID dibutuhkan"}), 400

    # Endpoint konversi publik yang aman dan bisa langsung dibuka di browser
    converter_url = f"https://yt1s.com.co/id/youtube-to-mp3?q=https://www.youtube.com/watch?v={video_id}"
    
    return jsonify({
        "status": "success",
        "videoId": video_id,
        "downloadWidget": converter_url
    })

if __name__ == '__main__':
    app.run(port=4000)