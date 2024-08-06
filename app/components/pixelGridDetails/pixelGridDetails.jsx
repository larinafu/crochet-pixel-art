import { useState } from "react";

import SizeDetails from "./sizeDetails/sizeDetails";
import ColorDetails from "./colorDetails/colorDetails";
import GaugeDetails from "./gaugeDetails/gaugeDetails";

import styles from "./pixelGridDetails.module.css";

export default function PixelGridDetails({
  numStitches,
  numRows,
  handleStitchChange,
  setCurColor,
  swatch,
  handleGaugeChange,
  widthHeightRatio,
  colorCounter,
  pixelSize,
  setPixelSize,
  pixelSizePreview,
  setPixelSizePreview,
}) {
  console.log("left panel rerendered");
  const [tempSwatch, setTempSwatch] = useState(swatch);
  return (
    <div className={styles.pixelGridDetailsContainer}>
      <GaugeDetails
        tempSwatch={tempSwatch}
        setTempSwatch={setTempSwatch}
        handleGaugeChange={handleGaugeChange}
      />
      <SizeDetails
        numStitches={numStitches}
        numRows={numRows}
        tempSwatch={tempSwatch}
        widthHeightRatio={widthHeightRatio}
        handleStitchChange={handleStitchChange}
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
      />
      <ColorDetails
        setCurColor={setCurColor}
        colorCounter={colorCounter}
      />
    </div>
  );
}
