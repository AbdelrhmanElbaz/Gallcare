import { useRef, useState, useEffect } from "react";
import { uploadService } from "../services/upload.service.js";

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

export default function Upload({ showToast }) {
  const [previews, setPreviews] = useState([]);
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    uploadService.getHistory()
      .then(setHistory)
      .catch(() => {});
  }, []);

  const handleFiles = async (files) => {
    if (!files || uploading) return;
    const selected = Array.from(files);
    setError("");
    setUploading(true);

    try {
      const results = await Promise.all(
        selected.map(async (file) => {
          const localPreview = { url: URL.createObjectURL(file), name: file.name };
          setPreviews((prev) => [...prev, localPreview]);
          return uploadService.upload(file);
        })
      );

      setHistory((prev) => [...results, ...prev]);
      showToast(
        selected.length === 1
          ? "Image uploaded successfully!"
          : `${selected.length} images uploaded successfully!`
      );
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="upload">
      <div className="section-head">
        <div className="section-label">Diagnostics</div>
        <h2 className="section-title">Upload your scan or image</h2>
        <p className="section-sub">
          Share ultrasound images, X-rays, or any scan for remote review by our specialists.
        </p>
      </div>

      <div
        className="upload-zone"
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
        onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("drag-over");
          handleFiles(e.dataTransfer.files);
        }}
        style={{ cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}
      >
        <span className="upload-icon">{uploading ? "⏳" : "🖼️"}</span>
        <h3>{uploading ? "Uploading…" : "Drop your image here or click to browse"}</h3>
        <p>Supports PNG, JPG, DICOM — max 20MB per file</p>
        <button
          className="btn-outline"
          type="button"
          disabled={uploading}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
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

      {error && (
        <p className="form-error" style={{ textAlign: "center", marginTop: 12 }}>{error}</p>
      )}

      <div id="preview-area">
        {previews.map((preview, index) => (
          <img key={index} src={preview.url} alt={preview.name} className="preview-thumb" />
        ))}
      </div>

      {history.length > 0 && (
        <div style={{ maxWidth: 560, margin: "32px auto 0" }}>
          <p style={{
            fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em",
            color: "var(--teal)", textTransform: "uppercase", marginBottom: 12,
          }}>
            Previous Uploads
          </p>
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {history.map((item, index) => (
              <div key={item.id || index} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", background: "white",
                borderTop: index !== 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "var(--teal-light)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>🩻</div>
                  <div>
                    <p style={{
                      fontSize: "0.9rem", fontWeight: 600, color: "var(--navy)",
                      margin: 0, maxWidth: 260, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {item.file_name || item.name}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0 }}>
                      {item.file_type?.toUpperCase() || "FILE"} · {item.size ? formatSize(item.size) : "—"}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {item.created_at ? formatDate(item.created_at) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
