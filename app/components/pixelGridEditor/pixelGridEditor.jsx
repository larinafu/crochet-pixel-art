import { useState } from "react";

import styles from './pixelGridEditor.module.css'

export default function PixelGridEditor({
  numStitches,
  setNumStitches,
  imgDim,
}) {
  console.log('pixelGridEditor rerendered');
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
    </div>
  );
}
