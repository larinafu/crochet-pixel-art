import { useState } from "react";

import SizeDetails from "./sizeDetails/sizeDetails";
import ColorDetails from "./colorDetails/colorDetails";
import GaugeDetails from "./gaugeDetails/gaugeDetails";

import styles from "./pixelGridDetails.module.css";
import ZoomDetails from "./zoomDetails/zoomDetails";

export default function PixelGridDetails({
  numStitches,
  numRows,
  maxStitches,
  handleStitchChange,
  setCurColor,
  swatch,
  handleGaugeChange,
  widthHeightRatio,
  colorCounter,
  pixelSize,
  setPixelSize,
  imgDim,
  pixelsPerRow
}) {
  console.log("left panel rerendered");
  return (
    <div className={styles.pixelGridDetailsContainer}>
      <GaugeDetails
        handleGaugeChange={handleGaugeChange}
        swatch={swatch}
      />
      <SizeDetails
        key={`whRatio-${widthHeightRatio}`}
        numStitches={numStitches}
        swatch={swatch}
        widthHeightRatio={widthHeightRatio}
        handleStitchChange={handleStitchChange}
        imgDim={imgDim}
      />
      <ZoomDetails
        pixelSize={pixelSize}f
        setPixelSize={setPixelSize}
        key={`initSize-${pixelSize}`}
      />
      <ColorDetails setCurColor={setCurColor} colorCounter={colorCounter} />
    </div>
  );
}
