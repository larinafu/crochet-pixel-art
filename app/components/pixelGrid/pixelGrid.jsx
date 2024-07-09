import { ModeContext } from "@/app/utils/ModeContext";
import { useState, useContext } from "react";
import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./pixelGrid.module.css";

export default function PixelGrid({
  pixels,
  curPixel,
  setPixel,
  curRow,
  setRow,
  isColorSelected,
  curColor,
  widthHeightRatio,
  isPending,
  pixelsDispatch,
  selectedPixels,
  setSelectedPixels,
}) {
  const isEditMode = useContext(ModeContext);

  const [curColorHovered, setCurColorHovered] = useState({});

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
    if (isEditMode) {
      if (pixel.checked) {
        return styles.activePixel;
      } else if (pixel.colorChecked) {
        return styles.activeColor;
      }
      if (
        (pixel.rowNum === curColorHovered.rowNum &&
          pixel.stitchNum === curColorHovered.stitchNum) ||
        pixel.colorName === curColor
      ) {
        return styles.hoveredBorder;
      }
    }
    return "";
  };

  const handlePixelClick = (pixel) => {
    if (pixel.checked) {
      setSelectedPixels(
        selectedPixels.filter(
          ([rowNum, stitchNum]) =>
            rowNum !== pixel.rowNum || stitchNum !== pixel.stitchNum
        )
      );
      pixelsDispatch({ type: "single_pixel_deselection", pixel: pixel });
    } else {
      setSelectedPixels([...selectedPixels, [pixel.rowNum, pixel.stitchNum]]);
      pixelsDispatch({
        type: "single_pixel_selection",
        pixel: pixel,
      });
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
                  !isEditMode && setRow(resRow);
                }}
                className={`${styles.colorCells}`}
              >
                {resRow.map((resItem) => {
                  const borderStyle = `${addRowBorder(
                    resRow,
                    resItem.stitchNum
                  )} ${addPixelBorder(resItem)}`;
                  return (
                    <div
                      key={resItem.stitchNum}
                      onMouseOver={() => {
                        setCurColorHovered(resItem);
                      }}
                      onMouseLeave={() => {
                        setCurColorHovered({});
                      }}
                      onClick={() => {
                        isEditMode && handlePixelClick(resItem);
                      }}
                      style={{
                        backgroundColor: resItem.hex,
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
