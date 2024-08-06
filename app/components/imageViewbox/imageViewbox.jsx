import Image from "next/image";
import { useRef, useContext } from "react";
import { PixelsContext } from "@/app/utils/context";
import { PIXEL_GRID_CONTAINER_PADDING } from "@/app/utils/constants";

import styles from "./imageViewbox.module.css";
import { vwToPx } from "@/app/utils/screenConversions";

export default function ImageViewbox({
  curImg,
  gridScrollPos,
  viewableGridRatios,
  pixelSize
}) {
  const [pixels, _] = useContext(PixelsContext);
  const imgRef = useRef(null);
  const imgWidth = imgRef.current?.clientWidth;
  const imgHeight = imgRef.current?.clientHeight;
  const windowPercentHeight = viewableGridRatios?.height * 100;
  const windowPercentWidth = viewableGridRatios?.width * 100;
  const percentFromTop = Math.max(gridScrollPos?.y, 0) * 100;
  const percentFromLeft = Math.max(gridScrollPos?.x, 0) * 100;

  const padding =
    (imgRef.current?.clientHeight / (pixels?.length * pixelSize)) *
    vwToPx(PIXEL_GRID_CONTAINER_PADDING);

  return (
    <section
      className={`detailContainer ${styles.container}`}
      style={{ padding: padding }}
    >
      <div
        className={styles.window}
        style={{
          width: `${windowPercentWidth}%`,
          height: `${windowPercentHeight}%`,
          top: `${percentFromTop}%`,
          left: `${percentFromLeft}%`,
        }}
      ></div>
      <img
        ref={imgRef}
        className={styles.smallImg}
        src={curImg}
        alt="uploaded image"
      />
    </section>
  );
}
