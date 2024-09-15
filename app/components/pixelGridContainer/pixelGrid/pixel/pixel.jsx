import { memo } from "react";

import styles from "./pixel.module.css";

export default memo(function Pixel({ setCurPixelHovered, handlePixelClick }) {
  const pixelStyles = {
    width: `${pixelSize}px`,
    aspectRatio: 1 / widthHeightRatio,
  };
  return (
    <div
      key={pixel.stitchNum}
      onMouseOver={() => {
        setCurPixelHovered(pixel);
      }}
      onMouseLeave={() => {
        setCurPixelHovered(null);
      }}
      onClick={() => {
        handlePixelClick(pixel);
      }}
      style={{
        ...pixelStyles,
        backgroundColor: pixel.colorHex,
      }}
      className={`${styles.colorCell} ${borderStyle}`}
    ></div>
  );
});
