import { PixelsContext } from "@/app/utils/context";
import { useState, useContext, useEffect, useRef, forwardRef } from "react";
import PixelEditingBlock from "../pixelEditor/pixelEditingBlock/pixelEditingBlock";
import styles from "./pixelGrid.module.css";

export default function PixelGrid({
  curPixelHovered,
  setCurPixelHovered,
  curRow,
  setCurRow,
  widthHeightRatio,
  isPending,
  toolSelections,
  pixelSize,
  gridContainerRef
}) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const pixelStyles = {
    width: `${pixelSize}px`,
    aspectRatio: 1 / widthHeightRatio,
  };

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

    switch (toolSelections.selectionOption) {
      case "single_pixel_select":
        if (pixel.singleSelected) {
          borders.push(top);
          borders.push(right);
          borders.push(bottom);
          borders.push(left);
        }
        break;
      case "multi_pixel_select":
      case "single_color_select":
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
        break;
      case "row_preview_select":
        if (pixel.rowNum === curRow) {
          borders.push(top);
          borders.push(bottom);
          if (pixel.stitchNum + 1 === pixels[0].length) borders.push(right);
          if (pixel.stitchNum - 1 === -1) borders.push(left);
        }
        break;

    }
    return `${borders.join(" ")}`;
  };

  const handlePixelClick = (pixel) => {
    const pixelLoc = { rowNum: pixel.rowNum, stitchNum: pixel.stitchNum };
    switch (toolSelections.selectionOption) {
      case "multi_pixel_select":
        if (pixel.singleSelected) {
          pixelsDispatch({ type: "pixel_deselection", pixel: pixel });
        } else {
          pixelsDispatch({
            type: "pixel_selection",
            pixel: pixel,
          });
        }
        break;
      case "single_color_select":
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
        break;
    }
  };

  return (
    <section className={`${styles.pixelGridContainer} detailContainer`} ref={gridContainerRef}>
      {isPending && (
        <div className={styles.loadingBanner}>
          <p>Recalculating...</p> <span className={styles.loader}></span>
        </div>
      )}
      <div
        className={`${styles.pixelGrid} ${
          isPending ? styles.loadingState : ""
        }`}
      >
        {pixels &&
          pixels.map((resRow, idx) => {
            return (
              <div
                key={idx}
                onClick={() => {
                  setCurRow(idx);
                }}
                className={`${styles.colorCells}`}
              >
                {resRow.map((pixel) => {
                  const borderStyle = `${addBorder(pixel)}`;
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
                })}
              </div>
            );
          })}
      </div>
    </section>
  );
};
