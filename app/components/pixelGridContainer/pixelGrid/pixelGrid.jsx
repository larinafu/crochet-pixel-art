import { PixelsContext, ActionContext } from "@/app/utils/context";
import { useContext } from "react";
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
  gridContainerRef,
}) {
  console.log("pixel grid rerendered");
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const setLastAction = useContext(ActionContext);

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
    // setLastAction("pixel_click");
  };

  return (
    <section
      className={`${styles.pixelGridContainer} detailContainer`}
      ref={gridContainerRef}
    >
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
                  toolSelections.highlightRow && setCurRow(idx);
                }}
                // onTouchStart={() => {
                //   toolSelections.highlightRow && setCurRow(idx);
                // }}
                className={`${styles.colorCells}`}
              >
                {resRow.map((pixel) => {
                  return (
                    <div
                      key={pixel.stitchNum}
                      onMouseOver={() => {
                        setCurPixelHovered(pixel);
                        // setLastAction("pixel_hover")
                      }}
                      onMouseLeave={() => {
                        setCurPixelHovered(null);
                      }}
                      onClick={() => {
                        handlePixelClick(pixel);
                      }}
                      // onTouchStart={() => {
                      //   handlePixelClick(pixel);
                      // }}
                      style={{
                        ...pixelStyles,
                        backgroundColor: pixel.colorHex,
                      }}
                      className={`${styles.colorCell} ${addBorder(pixel)}`}
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
