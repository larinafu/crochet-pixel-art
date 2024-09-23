import Image from "next/image";
import { useState } from "react";
import zoomIn from "@/public/icons/plus-icon.svg";
import zoomOut from "@/public/icons/minus-icon.svg";

import styles from "./zoomDetails.module.css";

export default function ZoomDetails({ pixelSize, setPixelSize, maxPixelSize }) {
  const [pixelSizePreview, setPixelSizePreview] = useState(pixelSize);
  return (
    <section className={`detailContainer ${styles.container}`}>
      <h3>Zoom Level</h3>
      <label htmlFor="pixelSize" className={styles.label}>
        zoom level
      </label>
      <div>
        <button
          className={`smallBtn ${styles.zoomBtn}`}
          onClick={(e) => {
            e.preventDefault();
            setPixelSizePreview(pixelSizePreview - 1);
            setPixelSize(pixelSize - 1);
          }}
          disabled={pixelSize <= 5}
        >
          <Image
            src={zoomOut}
            alt="zoom out"
            width={15}
            className={styles.zoomIcon}
            draggable={false}
          />
        </button>
        <input
          type="range"
          id="pixelSize"
          name="pixelSize"
          min="5"
          max={maxPixelSize}
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
          className={`smallBtn ${styles.zoomBtn}`}
          onClick={(e) => {
            e.preventDefault();
            setPixelSizePreview(pixelSizePreview + 1);
            setPixelSize(pixelSize + 1);
          }}
          disabled={pixelSize >= maxPixelSize}
        >
          <Image
            src={zoomIn}
            alt="zoom in"
            width={15}
            className={styles.zoomIcon}
            draggable={false}
          />
        </button>
      </div>
    </section>
  );
}
