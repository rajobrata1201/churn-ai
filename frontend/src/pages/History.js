import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/history")
      .then(res => setUploads(res.data))
      .catch(() => alert("Failed to load history"));
  }, []);

  const openUpload = (id) => {
    window.location.href = `/dashboard/${id}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload History</h2>

      {uploads.length === 0 && <p>No history yet</p>}

      {uploads.map(upload => (
        <div
          key={upload._id}
          onClick={() => openUpload(upload._id)}
          style={{
            background: "white",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <b>File:</b> {upload.fileName} <br />
          <b>Date:</b> {new Date(upload.uploadedAt).toLocaleString()} <br />
          <b>Users analyzed:</b> {upload.results?.length || 0}

          <div style={{ marginTop: "8px", color: "#888", fontSize: "12px" }}>
            Click to open full analysis →
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;