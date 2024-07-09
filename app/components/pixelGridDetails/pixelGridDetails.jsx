import { useState } from "react";

import SizeDetails from "./sizeDetails/sizeDetails";
import ColorDetails from "./colorDetails/colorDetails";
import GaugeDetails from "./gaugeDetails/gaugeDetails";

import styles from "./pixelGridDetails.module.css";

export default function PixelGridDetails({
  numStitches,
  numRows,
  detectedColors,
  handleStitchChange,
  setCurColor,
  curColor,
  curImg,
  color,
  setColor,
  pixels,
  replacePixelsWithSelectedColor,
  swatch,
  handleGaugeChange,
  widthHeightRatio,
  activeColorCounter,
}) {
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
        handleGaugeChange={handleGaugeChange}
        curImg={curImg}
        handleStitchChange={handleStitchChange}
      />
      <ColorDetails
        detectedColors={detectedColors}
        setCurColor={setCurColor}
        curColor={curColor}
        color={color}
        setColor={setColor}
        replacePixelsWithSelectedColor={replacePixelsWithSelectedColor}
        pixels={pixels}
        activeColorCounter={activeColorCounter}
      />
    </div>
  );
}
