import { useRef, useState } from "react";

export default function Upload({ showToast }) {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files) return;
    const selected = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews((prev) => [...prev, ...selected]);
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
        id="dropZone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("drag-over");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("drag-over");
        }}
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
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </button>
        <input
          ref={inputRef}
          type="file"
          id="fileInput"
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
    </section>
  );
}
