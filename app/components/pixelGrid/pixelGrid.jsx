import { ModeContext, PixelsContext } from "@/app/utils/context";
import { useState, useContext } from "react";
import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./pixelGrid.module.css";

export default function PixelGrid({
  curPixelHovered,
  setCurPixelHovered,
  curRow,
  setRow,
  curColor,
  widthHeightRatio,
  isPending,
  selectedPixels,
  setSelectedPixels,
  toolSelections,
}) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  console.log(pixels);

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
      case "single_color_select":
    }
    return `${borders.join(" ")}`;
  };

  const addRowBorder = (resRow, idx) => {
    if (resRow === curRow) {
      switch (idx) {
        case 0:
          return styles.addGoldBorderLeftEdge;
        case curRow.length - 1:
          return styles.addGoldBorderRightEdge;
        default:
          return styles.addGoldBorderTopBottom;
      }
    }
    return "";
  };

  const addPixelBorder = (pixel) => {
    if (pixel.singleSelected) {
      return styles.activePixel;
    } else if (pixel.colorChecked) {
      return styles.activeColor;
    }
    if (
      (pixel.rowNum === curPixelHovered?.rowNum &&
        pixel.stitchNum === curPixelHovered?.stitchNum) ||
      pixel.colorName === curColor
    ) {
      return styles.hoveredBorder;
    }
    return "";
  };

  const handlePixelClick = (pixel) => {
    const pixelLoc = { rowNum: pixel.rowNum, stitchNum: pixel.stitchNum };
    switch (toolSelections.selectionOption) {
      case "single_pixel_select":
        if (pixel.singleSelected) {
          setSelectedPixels([]);
          pixelsDispatch({ type: "pixel_deselection", pixel: pixel });
        } else {
          setSelectedPixels([pixelLoc]);
          pixelsDispatch({
            type: "pixel_selection",
            pixel: pixel,
          });
          if (selectedPixels.length !== 0) {
            pixelsDispatch({
              type: "pixel_deselection",
              pixel:
                pixels[selectedPixels[0].rowNum][selectedPixels[0].stitchNum],
            });
          }
        }
        break;
      case "multi_pixel_select":
        if (pixel.singleSelected) {
          setSelectedPixels(
            selectedPixels.filter(
              (p) =>
                p.rowNum !== pixel.rowNum || p.stitchNum !== pixel.stitchNum
            )
          );
          pixelsDispatch({ type: "pixel_deselection", pixel: pixel });
        } else {
          setSelectedPixels([...selectedPixels, pixelLoc]);
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
    <section className={styles.pixelGridContainer}>
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
                  setRow(resRow);
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
                        backgroundColor: pixel.colorHex,
                        aspectRatio: 1 / widthHeightRatio,
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
}
