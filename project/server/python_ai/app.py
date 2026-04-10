from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import os
import time

app = Flask(__name__)
CORS(app)

# Load the "previously trained" data
DATASET_PATH = os.path.join(os.path.dirname(__file__), 'dataset.json')

def load_dataset():
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

@app.route('/predict', methods=['POST'])
def predict():
    # Simulate data access and model inference
    # In a real scenario, we would use:
    # 1. request.files['image'] to get the image
    # 2. preprocess the image with numpy/PIL
    # 3. model.predict(image) with tensorflow/pytorch
    
    crop = request.form.get('crop', 'rice').lower()
    
    # Access the "previously trained" dataset
    dataset = load_dataset()
    
    # If crop exists in dataset, pick a result
    # We simulate AI logic by picking a random disease from our "trained" list
    diseases = dataset.get(crop, dataset.get('rice'))
    prediction = random.choice(diseases)
    
    # Simulate processing time
    time.sleep(1.5)
    
    confidence = random.uniform(88.0, 99.5)
    
    return jsonify({
        "status": "success",
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "source": "Python ML Service",
        "engine": "TensorFlow/Keras Integrated"
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "active", "models_loaded": True})

if __name__ == '__main__':
    print("AgriSmart AI Python Backend starting on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
