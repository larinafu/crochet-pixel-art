import { useState } from "react";

import styles from "./pixelGridEditor.module.css";

export default function PixelGridEditor({
  numStitches,
  setNumStitches,
  imgDim,
  detectedColors,
}) {
  console.log("pixelGridEditor rerendered");
  console.log(Object.keys(detectedColors), numStitches);
  const [sliderValueDisplay, setSliderValueDisplay] = useState(numStitches);
  const numRows = Math.floor(
    imgDim && imgDim.height / (imgDim.width / sliderValueDisplay)
  );
  return (
    <div>
      <section>
        <h2>Pattern specs</h2>
        <p>{sliderValueDisplay} stitches per row</p>
        <p>{numRows} rows</p>
      </section>
      <section className={styles.stitchSlider}>
        <label htmlFor="numStitches">Number of stiches per row:</label>
        <input
          type="range"
          id="numStitches"
          name="numStitches"
          min="15"
          max="300"
          value={sliderValueDisplay}
          onChange={(e) => {
            setSliderValueDisplay(e.target.value);
          }}
          onMouseUp={(e) => {
            setNumStitches(e.target.value);
          }}
        />
      </section>
      <section>
        {Object.keys(detectedColors).map((colorName) => (
          <div key={colorName}>
            <input type="checkbox" id={colorName} name={colorName}></input>
            <label htmlFor={colorName}>{colorName}</label>
          </div>
        ))}
      </section>
    </div>
  );
}
