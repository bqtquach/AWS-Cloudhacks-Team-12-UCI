import { useState } from 'react';
import MetadataDisplay from './MetadataDisplay';
import './style.css';

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setImageFile(file);
    setMetadata(null);
    setError(null);
  };

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
      <h1 className="title">Image Analysis Tool</h1>

      <div className="grid-container">
        <div className="card">
          <h2>Upload Image</h2>
          <label className="upload-box">
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
          <div className="analysis-box scrollable-box">
            {loading && <p>Analyzing image...</p>}
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