from flask import Flask, jsonify, request
from main import summarize_text  
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route("/", methods=["POST"])
def summarize():
    url = request.form.get('url')  
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400

    try:
        summarized_text = summarize_text(url)  
        return jsonify({"summarized_text": summarized_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
