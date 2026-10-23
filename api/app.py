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

    # Menggunakan Cobalt Web Service yang stabil & bebas iklan/error
    cobalt_url = f"https://cobalt.tools/#https://www.youtube.com/watch?v={video_id}"
    
    return jsonify({
        "status": "success",
        "videoId": video_id,
        "downloadWidget": cobalt_url
    })

if __name__ == '__main__':
    app.run(port=4000)