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
}) {
  const [sliderValueDisplay, setSliderValueDisplay] = useState(numStitches);

  const estWidth = Math.round((numStitches * 4) / tempSwatch.width);
  const estHeight = Math.round((numRows * 4) / tempSwatch.height);

  return (
    <>
      <section className="detailContainer">
        <h3>Size Estimate</h3>
        <>
          <label htmlFor="numStitches">stiches per row:</label>
          <input
            type="range"
            id="numStitches"
            name="numStitches"
            min="15"
            max="200"
            value={sliderValueDisplay}
            onChange={(e) => {
              setSliderValueDisplay(e.target.value);
            }}
            onMouseUp={(e) => {
              handleStitchChange(e.target.value);
            }}
          />
        </>
        <p>{numRows} rows</p>
        <p>{sliderValueDisplay} stitches per row</p>
        <p>height: {estHeight} in.</p>
        <p>width: {estWidth} in.</p>
      </section>
    </>
  );
}
