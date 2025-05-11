import { useState } from 'react';
import analysisData from './data.json';
import compareData from './comparemessage.json';
import MetadataDisplay from './MetadataDisplay';
import './style.css';

function AnalyzePage({ switchPage }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowAnalysis(false); // reset metadata
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (imageSrc) {
      setShowAnalysis(true);
    } else {
      alert("Please upload an image first.");
    }
  };

  return (
    <div className="app-modern">
      <h1 className="title">Image Analysis Tool</h1>

      <div className="tabs">
        <button className="tab active">Analyze Image</button>
        <button className="tab" onClick={() => switchPage('compare')}>Compare Images</button>
      </div>

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
            {showAnalysis ? (
              <MetadataDisplay data={analysisData} />
            ) : (
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

function ComparePage({ switchPage }) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCompare = () => {
    if (image1 && image2) {
      setShowResult(true);
    } else {
      alert("Please upload both images first.");
    }
  };

  return (
    <div className="app-modern">
      <h1 className="title">Image Analysis Tool</h1>

      <div className="tabs">
        <button className="tab" onClick={() => switchPage('analyze')}>Analyze Image</button>
        <button className="tab active">Compare Images</button>
      </div>

      <div className="grid-container">
        <div className="card">
          <h2>First Image</h2>
          <label className="upload-box">
            {image1 ? (
              <img src={image1} alt="First" className="preview-image" />
            ) : (
              <>
                <div className="upload-icon">🖼</div>
                <p><strong>Drag and drop image here</strong></p>
                <p className="hint">or click to browse</p>
                <p className="select-file">Select file</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage1)} hidden />
          </label>
        </div>

        <div className="card">
          <h2>Second Image</h2>
          <label className="upload-box">
            {image2 ? (
              <img src={image2} alt="Second" className="preview-image" />
            ) : (
              <>
                <div className="upload-icon">🖼</div>
                <p><strong>Drag and drop image here</strong></p>
                <p className="hint">or click to browse</p>
                <p className="select-file">Select file</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage2)} hidden />
          </label>
        </div>
      </div>

      <div className="compare-btn-container">
        <button className="compare-btn" onClick={handleCompare}>Compare Images</button>
      </div>

      {showResult && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Comparison Result</h2>
          <MetadataDisplay data={compareData} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('analyze');
  return activePage === 'analyze'
    ? <AnalyzePage switchPage={setActivePage} />
    : <ComparePage switchPage={setActivePage} />;
}
