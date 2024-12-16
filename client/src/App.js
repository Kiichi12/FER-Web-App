import './App.css';
import React, { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [emotion, setEmotion] = useState("");

  // Handle file selection and create image preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Generate a preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please upload a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEmotion(data.emotion);
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file or predicting emotion!");
    }
  };

  return (
    <div className="App">
      <h1 className="h1">Emotion Classifier</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload and Predict</button>
      </form>
      
      {/* Display image preview */}
      {previewImage && (
        <div className="preview-container">
          <h2>Image Preview:</h2>
          <img src={previewImage} alt="Uploaded" className="preview-image" />
        </div>
      )}

      {/* Display predicted emotion */}
      {emotion && <h2>Predicted Emotion: {emotion}</h2>}
    </div>
  );
}

export default App;
