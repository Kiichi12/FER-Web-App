from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Load the model
model = load_model("model/model_file.h5")  # Adjust the path as needed

# Define emotion labels
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    
    try:
        # Open image and preprocess
        img = Image.open(file).convert("L").resize((40, 40))  # Convert to grayscale and resize to 48x48
        img_array = np.array(img, dtype=np.float32) / 255.0  # Normalize pixel values
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension for grayscale

        # Predict using the model
        predictions = model.predict(img_array)
        emotion_idx = np.argmax(predictions)
        emotion = EMOTIONS[emotion_idx]

        return jsonify({"emotion": emotion})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
