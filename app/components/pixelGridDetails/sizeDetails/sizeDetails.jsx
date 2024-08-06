import width from "@/public/icons/width.svg";
import height from "@/public/icons/height.svg";

import { ModeContext } from "@/app/utils/context";
import { useContext, useState, useEffect, useTransition } from "react";
import Image from "next/image";

import styles from "./sizeDetails.module.css";

export default function SizeDetails({
  numStitches,
  tempSwatch,
  handleStitchChange,
  numRows,
  pixelSize,
  setPixelSize,
}) {
  console.log("size details rerendered");
  const [sliderValueDisplay, setSliderValueDisplay] = useState(numStitches);
  const [pixelSizePreview, setPixelSizePreview] = useState(pixelSize);
  console.log(typeof pixelSize);

  const estWidth = Math.round((numStitches * 4) / tempSwatch.width);
  const estHeight = Math.round((numRows * 4) / tempSwatch.height);

  return (
    <section className="detailContainer">
      <h3>Size Estimate</h3>
      <label htmlFor="numStitches">stiches per row:</label>
      <input
        type="range"
        id="numStitches"
        name="numStitches"
        min="15"
        max="200"
        value={sliderValueDisplay}
        onChange={(e) => {
          setSliderValueDisplay(e.target.valueAsNumber);
        }}
        onMouseUp={(e) => {
          handleStitchChange(e.target.valueAsNumber);
        }}
      />
      <p>{numRows} rows</p>
      <p>{sliderValueDisplay} stitches per row</p>
      <p>height: {estHeight} in.</p>
      <p>width: {estWidth} in.</p>
      <h3>View</h3>
      <label htmlFor="pixelSize">zoom level</label>
      <button
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
        max="40"
        step="5"
        value={pixelSizePreview}
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
        onClick={() => {
          setPixelSizePreview(pixelSizePreview + 5);
          setPixelSize(pixelSize + 5);
        }}
        disabled={pixelSize >= 40}
      >
        +
      </button>
    </section>
  );
}
