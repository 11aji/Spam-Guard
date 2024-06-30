from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route('/save_email_data', methods=['POST'])
def save_email_data():
    data = request.json
    print("Received data:", data)  # Print received data for debugging
    # Process and save data as needed
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080)
