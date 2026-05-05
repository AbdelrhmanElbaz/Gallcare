import { useRef, useState } from "react";

export default function Upload({ showToast }) {
  const [previews, setPreviews] = useState([]);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files) => {
    if (!files) return;
    const selected = Array.from(files);

    const newPreviews = selected.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    const newHistory = selected.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatSize(file.size),
      type: file.type.split("/")[1]?.toUpperCase() || "FILE",
      date: formatDate(new Date()),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setHistory((prev) => [...newHistory, ...prev]);
    showToast("Image uploaded successfully!");
  };

  return (
    <section id="upload">
      <div className="section-head">
        <div className="section-label">Diagnostics</div>
        <h2 className="section-title">Upload your scan or image</h2>
        <p className="section-sub">
          Share ultrasound images, X-rays, or any scan for remote review by our
          specialists.
        </p>
      </div>

      <div
        className="upload-zone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("drag-over");
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("drag-over");
          handleFiles(e.dataTransfer.files);
        }}
      >
        <span className="upload-icon">🖼️</span>
        <h3>Drop your image here or click to browse</h3>
        <p>Supports PNG, JPG, DICOM — max 20MB per file</p>
        <button
          className="btn-outline"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div id="preview-area">
        {previews.map((preview, index) => (
          <img
            key={index}
            src={preview.url}
            alt={preview.name}
            className="preview-thumb"
          />
        ))}
      </div>

      {history.length > 0 && (
        <div style={{ maxWidth: 560, margin: "32px auto 0" }}>
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--teal)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Previous Uploads
          </p>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            {history.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "white",
                  borderTop: index !== 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--teal-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    🩻
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--navy)",
                        margin: 0,
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--muted)",
                        margin: 0,
                      }}
                    >
                      {item.type} · {item.size}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
