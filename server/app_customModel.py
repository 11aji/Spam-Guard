from flask import Flask, request, jsonify
from textblob import TextBlob
from textblob.classifiers import NaiveBayesClassifier
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)


with open('spam_classifier1k.pkl', 'rb') as f:
    classifier = pickle.load(f)

def classify_email(email_text):
  
    classification = classifier.classify(email_text)
    
    if classification == 'spam':
        return 'high'
    else:
        analysis = TextBlob(email_text)
        sentiment = analysis.sentiment
        if sentiment.polarity < 0:
            return 'medium'
        else:
            return 'low'

@app.route('/classify', methods=['POST'])
def classify():
    try:
        email_text = request.json.get('email_text', '')
        spam_classification = classify_email(email_text)
        return jsonify({'spam_classification': spam_classification})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return "Server is running!"

if __name__ == '__main__':
    app.run(debug=True)
