import { useState } from "react";

import styles from "./zoomDetails.module.css";

export default function ZoomDetails({ pixelSize, setPixelSize, maxPixelSize }) {
  const [pixelSizePreview, setPixelSizePreview] = useState(pixelSize);
  return (
    <section className={`detailContainer ${styles.container}`}>
      <h3>View</h3>
      <label htmlFor="pixelSize">zoom level</label>
      <div>
        <button
          className={`smallBtn`}
          onClick={() => {
            setPixelSizePreview(pixelSizePreview - 5);
            setPixelSize(pixelSize - 5);
          }}
          disabled={pixelSize <= 5}
        >
          -
        </button>
        <input
          type="range"
          id="pixelSize"
          name="pixelSize"
          min="5"
          max={maxPixelSize}
          step="5"
          value={pixelSizePreview}
          className={styles.slider}
          onChange={(e) => {
            setPixelSizePreview(e.target.value);
          }}
          onMouseUp={(e) => {
            setPixelSize(e.target.valueAsNumber);
            setPixelSizePreview(e.target.valueAsNumber);
          }}
          onTouchEnd={(e) => {
            setPixelSize(e.target.valueAsNumber);
            setPixelSizePreview(e.target.valueAsNumber);
          }}
        />
        <button
          className={`smallBtn`}
          onClick={() => {
            setPixelSizePreview(pixelSizePreview + 5);
            setPixelSize(pixelSize + 5);
          }}
          disabled={pixelSize >= maxPixelSize}
        >
          +
        </button>
      </div>
    </section>
  );
}
