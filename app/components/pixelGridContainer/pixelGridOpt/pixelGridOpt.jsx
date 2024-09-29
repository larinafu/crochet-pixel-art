import { Grid, AutoSizer } from "react-virtualized";
import { PixelsContext } from "@/app/utils/context";
import { useContext, useEffect, useRef, useState } from "react";

import styles from "./pixelGridOpt.module.css";

export default function PixelGridOpt({
  curPixelHovered,
  setCurPixelHovered,
  curRow,
  setCurRow,
  gridContainerDim,
  gridHeight,
  gridWidth,
  gridScrollPos,
  setGridScrollPos,
  widthHeightRatio,
  toolOptions,
  pixelSize,
  gridContainerRef,
}) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const [isPointerDown, setPointerDown] = useState(false);
  console.log(gridScrollPos);

  useEffect(() => {
    const handlePointerUp = (e) => {
      setPointerDown(false);
    };
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const addBorder = (pixel) => {
    let borders = [];
    if (
      curPixelHovered?.rowNum === pixel.rowNum &&
      curPixelHovered?.stitchNum === pixel.stitchNum
    ) {
      borders.push(styles.hoveredBorder);
    }
    const [top, right, bottom, left] = [
      styles.topGoldBorder,
      styles.rightGoldBorder,
      styles.bottomGoldBorder,
      styles.leftGoldBorder,
    ];

    const [topRow, rightRow, bottomRow, leftRow] = [
      styles.topPurpBorder,
      styles.rightPurpBorder,
      styles.bottomPurpBorder,
      styles.leftPurpBorder,
    ];

    if (toolOptions.highlight.subOptions.highlightRow) {
      if (pixel.rowNum === curRow) {
        borders.push(topRow);
        borders.push(bottomRow);
        if (pixel.stitchNum + 1 === pixels[0].length) borders.push(rightRow);
        if (pixel.stitchNum - 1 === -1) borders.push(leftRow);
      }
    }

    if (pixel.singleSelected) {
      for (const [rowStep, stitchStep] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]) {
        const [newRow, newStitch] = [
          pixel.rowNum + rowStep,
          pixel.stitchNum + stitchStep,
        ];

        // check if out of bounds
        if (
          newRow < 0 ||
          newRow === pixels.length ||
          newStitch < 0 ||
          newStitch === pixels[0].length
        ) {
          if (newRow < 0) borders.push(top);
          else if (newRow === pixels.length) borders.push(bottom);
          else if (newStitch < 0) borders.push(left);
          else borders.push(right);
        } else {
          if (!pixels[newRow][newStitch].singleSelected) {
            if (rowStep === 1) borders.push(bottom);
            else if (rowStep === -1) borders.push(top);
            else if (stitchStep === 1) borders.push(right);
            else borders.push(left);
          }
        }
      }
    }
    return `${borders.join(" ")}`;
  };

  const handlePixelClick = (pixel) => {
    if (toolOptions.select.subOptions.colorSelect) {
      if (pixel.singleSelected) {
        pixelsDispatch({
          type: "color_deselection",
          colorHex: pixel.colorHex,
        });
      } else {
        pixelsDispatch({
          type: "color_selection",
          colorHex: pixel.colorHex,
        });
      }
    } else if (toolOptions.select.subOptions.pixelSelect) {
      if (pixel.singleSelected) {
        pixelsDispatch({ type: "pixel_deselection", pixel: pixel });
      } else {
        pixelsDispatch({
          type: "pixel_selection",
          pixel: pixel,
        });
      }
    }
  };

  function cellRenderer({ key, columnIndex, rowIndex, style }) {
    const pixel = pixels[rowIndex][columnIndex];
    return (
      <div
        key={key}
        className={`${styles.colorCell} ${addBorder(pixel)}`}
        style={{
          ...style,
          backgroundColor: pixel.colorHex,
        }}
        onPointerOver={() => {
          if (isPointerDown) {
            handlePixelClick(pixel);
          }
          setCurPixelHovered(pixel);
        }}
        onPointerLeave={() => {
          setCurPixelHovered(null);
        }}
        onPointerDown={() => {
          handlePixelClick(pixel);
        }}
      ></div>
    );
  }

  return (
    <section
      className={`${styles.pixelGridContainer} detailContainer`}
      onPointerDown={(e) => {
        e.preventDefault();
        setPointerDown(true);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        setPointerDown(false);
      }}
      ref={gridContainerRef}
    >
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={pixels[0].length}
              columnWidth={pixelSize}
              height={height}
              rowCount={pixels.length}
              rowHeight={pixelSize * widthHeightRatio}
              width={width}
              scrollLeft={
                (gridWidth * gridContainerDim.viewableGridLeftPercent) / 100
              }
              scrollTop={
                (gridHeight * gridContainerDim.viewableGridTopPercent) / 100
              }
            ></Grid>
          );
        }}
      </AutoSizer>
    </section>
  );
}
