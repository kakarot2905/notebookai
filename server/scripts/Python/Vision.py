from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from google.cloud import vision
from google.api_core.client_options import ClientOptions
import openai
import os
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app) 

# MongoDB Configuration
# app.config["MONGO_URI"] = "mongodb+srv://note:note@cluster0.jxd0m.mongodb.net/"  # Update with your MongoDB URI
# mongo = PyMongo(app)

# Configure APIs
api_key_vision = "api_key"  # Use environment variable in production
client_options = ClientOptions(api_key=api_key_vision)
vision_client = vision.ImageAnnotatorClient(client_options=client_options)
openai.api_key = "api_key"  # Use environment variable in production

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'image' not in request.files: 
            return jsonify({'error': 'No image provided'}), 400
            
        image_file = request.files['image']
        content = image_file.read()
        
        # Google Vision processing
        image = vision.Image(content=content)
        response = vision_client.document_text_detection(image=image)
        extracted_text = response.full_text_annotation.text

        # OpenAI processing
        prompt = f"Clean and structure this handwritten text:\n{extracted_text}"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful text cleaner."},
                {"role": "user", "content": prompt}
            ]
        )
        cleaned_text = response['choices'][0]['message']['content']

        return jsonify({
            'extracted_text': extracted_text,
            'cleaned_text': cleaned_text  
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @app.route('/save_note', methods=['POST'])
# def save_note():
#     # Save note to MongoDB
#     note = request.json.get('note')
#     if note:
#         mongo.db.notes.insert_one({'note': note})
#         return jsonify({'success': True, 'note': note}), 200
#     else:
#         return jsonify({'error': 'No note provided'}), 400

# @app.route('/get_notes', methods=['GET'])
# def get_notes():
#     notes = mongo.db.notes.find()
#     return jsonify({'notes': [note['note'] for note in notes]}), 200

if __name__ == '__main__':
    print("executed")
    app.run(debug=True, port=4000)
 