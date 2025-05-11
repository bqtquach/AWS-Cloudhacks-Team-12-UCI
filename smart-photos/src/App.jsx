import { useState } from 'react';
import MetadataDisplay from './MetadataDisplay';
import './style.css';

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setImageFile(file);
    setMetadata(null);
    setError(null);
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleGenerate = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setMetadata(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('http://localhost:8080/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to get analysis from server');
      const result = await response.json();
      const parsed = typeof result === 'string' ? JSON.parse(result) : result;

      setMetadata(parsed);
    } catch (err) {
      console.error(err);
      setError('Image analysis failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-modern">
      <h1 className="title">Smart Photos</h1>
      <p className="app-description" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', fontSize: '1rem', color: '#555' }}>
        <strong>Smart Photos</strong> is an AI-powered tool that analyzes images to detect key features like lighting, subjects, facial expressions, and camera settings. 
        Upload a portrait-style image and click <strong>Generate</strong> to receive personalized feedback and composition insights to improve your photography.
      </p>

      <div className="grid-container" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2>Upload Image</h2>
          <p className="column-description">
            Drag or select a portrait image (JPG/PNG). A preview will be shown here. This image will be sent to our AI system for analysis.
          </p>
          <label
            className={`upload-box ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded" className="preview-image" />
            ) : (
              <>
                <div className="upload-icon">🖼</div>
                <p><strong>Drag and drop image here</strong></p>
                <p className="hint">or click to browse</p>
                <p className="select-file">Select file</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>

        <div className="card">
          <h2>Image Analysis</h2>
          <p className="column-description">
            This section will show AI-generated metadata including mood, composition, lighting, and camera guidance based on your image.
          </p>
          <div className="analysis-box scrollable-box">
            {loading && (
              <div style={{ color: '#555' }}>
                <p>Analyzing image...</p>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Note: Image processing may take 1–2 minutes.
                </p>
              </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {metadata && <MetadataDisplay data={metadata} />}
            {!loading && !metadata && !error && (
              <>
                <div className="upload-icon">🖼</div>
                <p className="hint">Upload an image and click "Generate" to see analysis</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="compare-btn-container">
        <button className="compare-btn" onClick={handleGenerate}>Generate</button>
      </div>
    </div>
  );
}
