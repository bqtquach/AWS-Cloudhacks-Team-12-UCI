import { useState } from 'react';
import './style.css';

function AnalyzePage({ switchPage }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
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
          <div className="analysis-box">
            {imageSrc ? (
              <p>Showing analysis results...</p>
            ) : (
              <>
                <div className="upload-icon">🖼</div>
                <p className="hint">Upload an image to see analysis results</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparePage({ switchPage }) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const handleUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
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
            <input type="file" hidden onChange={(e) => handleUpload(e, setImage1)} />
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
            <input type="file" hidden onChange={(e) => handleUpload(e, setImage2)} />
          </label>
        </div>
      </div>

      <div className="compare-btn-container">
        <button className="compare-btn">Compare Images</button>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('analyze');

  return activePage === 'analyze' ? (
    <AnalyzePage switchPage={setActivePage} />
  ) : (
    <ComparePage switchPage={setActivePage} />
  );
}
