import { useState } from "react";
import { toast } from "react-toastify";

import NumberContainer from "../../general/numberContainer/numberContainer";
import UpdateContainer from "../../general/updateContainer/updateContainer";

import styles from "./sizeDetails.module.css";

export default function SizeDetails({
  numStitches,
  swatch,
  handleStitchChange,
  widthHeightRatio,
  imgDim,
}) {
  const [numStitchesDisplay, setNumStitchesDisplay] = useState(numStitches);

  let maxStitches = Math.min(200, imgDim?.width);
  const maxStitchesWithRowLimit = Math.floor(
    (imgDim?.width * widthHeightRatio * maxStitches) / imgDim?.height
  );
  maxStitches = Math.min(maxStitches, maxStitchesWithRowLimit);

  const pixelsPerStitch = imgDim?.width / numStitchesDisplay;
  const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
  const numRowsDisplay = Math.floor(imgDim?.height / pixelsPerRow);

  const estWidth = Math.round((numStitchesDisplay * 4) / swatch.width);
  const estHeight = Math.round((numRowsDisplay * 4) / swatch.height);

  const handleUpdate = () => {
    if (numStitchesDisplay === numStitches) {
      toast("No changes detected", {
        toastId: "."
      })
    } else {
      handleStitchChange(numStitchesDisplay);
    }
  }

  return (
    <UpdateContainer
      handleUpdate={handleUpdate}
      handleCancelledForm={() => {
        setNumStitchesDisplay(numStitches);
      }}
      sectionHeader="Size Estimate"
    >
      <div>
        <label htmlFor="numStitches">adjust project size:</label>
        <input
          type="range"
          id="numStitches"
          name="numStitches"
          min="1"
          max={maxStitches}
          value={numStitchesDisplay}
          onChange={(e) => {
            setNumStitchesDisplay(e.target.valueAsNumber);
          }}
          className={styles.sizeInput}
        />
        <div className={styles.specItem}>
          <NumberContainer number={numRowsDisplay} />
          <p className={styles.specDesc}>rows</p>
        </div>
        <div className={styles.specItem}>
          <NumberContainer number={numStitchesDisplay} />
          <p className={styles.specDesc}>stitches per row</p>
        </div>
        <div className={styles.specItem}>
          <NumberContainer number={estHeight} />
          <p className={styles.specDesc}>in. tall (height)</p>
        </div>
        <div className={styles.specItem}>
          <NumberContainer number={estWidth} />
          <p className={styles.specDesc}>in. wide (width)</p>
        </div>
      </div>
    </UpdateContainer>
  );
}
