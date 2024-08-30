import { useState } from "react";

import SizeDetails from "./sizeDetails/sizeDetails";
import ColorDetails from "./colorDetails/colorDetails";
import GaugeDetails from "./gaugeDetails/gaugeDetails";

import styles from "./pixelGridDetails.module.css";
import ZoomDetails from "./zoomDetails/zoomDetails";

export default function PixelGridDetails({
  numStitches,
  handleStitchChange,
  setCurColor,
  swatch,
  handleGaugeChange,
  widthHeightRatio,
  colorCounter,
  pixelSize,
  setPixelSize,
  imgDim,
  maxPixelSize
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
        pixelSize={pixelSize}
        setPixelSize={setPixelSize}
        maxPixelSize={maxPixelSize}
        key={`initSize-${pixelSize}`}
      />
      <ColorDetails setCurColor={setCurColor} colorCounter={colorCounter} />
    </div>
  );
}
