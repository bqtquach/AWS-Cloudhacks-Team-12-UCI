import React, { useState } from 'react';
import './style.css';

export default function MetadataDisplay({ data }) {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  if (!data || (!data.summary && !data.accordion)) return <p>No metadata available.</p>;

  return (
    <div className="analysis-container">
      {/* Summary Section */}
      {data.summary && typeof data.summary === 'object' && (
        <div className="summary-section">
          <h2>Summary</h2>
          <table>
            <tbody>
              {Object.entries(data.summary).map(([key, value]) => (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accordion Section */}
      {data.accordion && typeof data.accordion === 'object' && (
        <div className="accordion-section">
          {Object.entries(data.accordion).map(([key, value]) => (
            <div key={key} className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(key)}>
                <span>{capitalize(key)}</span>
                <span>{openSection === key ? '▲' : '▼'}</span>
              </div>

              {openSection === key && (
                <div className="accordion-content">
                  {/* Special handling for 'cues' (array of objects) */}
                  {key === 'cues' && Array.isArray(value) ? (
                    <ul>
                      {value.map((cue, idx) => (
                        <li key={idx} style={{ marginBottom: '1rem' }}>
                          <strong>{cue.title}</strong><br />
                          {cue.instruction}<br />
                          <em>{cue.note}</em>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    Array.isArray(value) && (
                      <ul>
                        {value.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}
