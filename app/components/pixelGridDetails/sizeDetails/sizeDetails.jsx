import { ModeContext } from "@/app/utils/ModeContext";
import { useContext, useState, useEffect, useTransition } from "react";

import styles from "./sizeDetails.module.css";

export default function SizeDetails({
  numStitches,
  tempSwatch,
  handleStitchChange,
  numRows,
  curImg,
}) {
  const isEditMode = useContext(ModeContext);
  const [sliderValueDisplay, setSliderValueDisplay] = useState(numStitches);
  
  const estWidth = Math.round((numStitches * 4) / tempSwatch.width);
  const estHeight = Math.round((numRows * 4) / tempSwatch.height);

  return (
    <>
      <section className="detailContainer">
        <h3>Project Size</h3>
        {isEditMode && (
          <>
            <label htmlFor="numStitches">Number of stiches per row:</label>
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
        )}

        <p>{sliderValueDisplay} stitches per row</p>
        <p>{numRows} rows</p>
        <p>~{estHeight} inches tall</p>
        {curImg && <img src={curImg} className={styles.imagePreview} />}
        <p>~{estWidth} inches wide</p>
      </section>
    </>
  );
}
