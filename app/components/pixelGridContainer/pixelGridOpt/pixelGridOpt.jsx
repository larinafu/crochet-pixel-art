import { Grid, AutoSizer } from "react-virtualized";
import { PixelsContext, ActionContext } from "@/app/utils/context";
import { useContext, useState } from "react";

import styles from "./pixelGridOpt.module.css";

export default function PixelGridOpt({
  curPixelHovered,
  setCurPixelHovered,
  curRow,
  setCurRow,
  gridScrollPos,
  setGridScrollPos,
  widthHeightRatio,
  toolSelections,
  pixelSize,
  gridContainerRef,
}) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const [isMouseDown, setMouseDown] = useState(false);

  const gridHeight = pixels.length * (pixelSize * widthHeightRatio);
  const gridWidth = pixels[0].length * pixelSize;

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

    if (toolSelections.highlightRow) {
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
    if (toolSelections.singleColorSelect) {
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
    } else if (toolSelections.multiPixelSelect) {
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

  function cellRenderer({ columnIndex, key, rowIndex, style }) {
    const pixel = pixels[rowIndex][columnIndex];
    return (
      <div
        key={key}
        // draggable={true}
        className={`${styles.colorCell} ${addBorder(pixel)}`}
        style={{
          ...style,
          backgroundColor: pixel.colorHex,
        }}
        onMouseOver={() => {
          if (isMouseDown) {
            handlePixelClick(pixel);
          }
          setCurPixelHovered(pixel);
        }}
        onMouseLeave={() => {
          setCurPixelHovered(null);
        }}
        onMouseDown={() => {
          handlePixelClick(pixel);
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
        onTouchStart={() => {
          handlePixelClick(pixel);
        }}
      ></div>
    );
  }

  return (
    <section
      className={`${styles.pixelGridContainer} detailContainer`}
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
              onScroll={(e) => {
                setGridScrollPos({
                  top: e.scrollTop / gridHeight,
                  left: e.scrollLeft / gridWidth,
                });
              }}
              scrollLeft={
                gridWidth < width ? 0 : gridScrollPos.left * gridWidth
              }
              scrollTop={
                gridHeight < height ? 0 : gridScrollPos.top * gridHeight
              }
            />
          );
        }}
      </AutoSizer>
    </section>
  );
}
