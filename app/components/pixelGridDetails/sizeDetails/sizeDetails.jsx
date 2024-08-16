import { useState } from "react";
import UpdateContainer from "../../updateContainer/updateContainer";

import styles from "./sizeDetails.module.css";

export default function SizeDetails({
  numStitches,
  swatch,
  handleStitchChange,
  widthHeightRatio,
  imgDim,
}) {
  console.log("size details rerendered");
  console.log(numStitches);
  const [numStitchesDisplay, setNumStitchesDisplay] = useState(numStitches);

  let maxStitches = 200;
  const maxStitchesWithRowLimit = Math.floor(
    (imgDim?.width * widthHeightRatio * 200) / imgDim?.height
  );
  maxStitches = Math.min(maxStitches, maxStitchesWithRowLimit);

  const pixelsPerStitch = imgDim?.width / numStitchesDisplay;
  const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
  const numRowsDisplay = Math.floor(imgDim?.height / pixelsPerRow);

  const estWidth = Math.round((numStitchesDisplay * 4) / swatch.width);
  const estHeight = Math.round((numRowsDisplay * 4) / swatch.height);

  return (
    <UpdateContainer
      handleUpdate={() => {
        handleStitchChange(numStitchesDisplay);
      }}
      handleCancelledForm={() => {
        console.log(numStitches);
        setNumStitchesDisplay(numStitches);
      }}
    >
      <h3>Size Estimate</h3>
      <label htmlFor="numStitches">adjust project size:</label>
      <input
        type="range"
        id="numStitches"
        name="numStitches"
        min="15"
        max={maxStitches}
        value={numStitchesDisplay}
        onChange={(e) => {
          setNumStitchesDisplay(e.target.valueAsNumber);
        }}
      />
      <p>{numRowsDisplay} rows</p>
      <p>{numStitchesDisplay} stitches per row</p>
      <p>height: {estHeight} in.</p>
      <p>width: {estWidth} in.</p>
    </UpdateContainer>
  );
}
