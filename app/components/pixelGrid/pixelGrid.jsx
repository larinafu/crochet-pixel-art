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
  handlePixelSelect,
  pixelsSelected,
}) {
  console.log("pixelGrid rerendered");
  const isEditMode = useContext(ModeContext);

  const [curColorClicked, setCurColorClicked] = useState("");

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
    } else {
      return "";
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
                {resRow.map((resItem, itemIdx) => {
                  const borderStyle = addRowBorder(resRow, itemIdx);
                  const isPixelSelected = pixelsSelected[
                    resItem.colorName
                  ]?.some(
                    (colorObj) =>
                      colorObj.row === idx &&
                      colorObj.column === itemIdx &&
                      colorObj.checked
                  );

                  const isCellHighlighted = isEditMode
                    ? isPixelSelected
                    : curColor === resItem.colorName;
                  return (
                    <div
                      key={itemIdx}
                      onMouseOver={() => {
                        if (!isColorSelected) {
                          setPixel(`${idx},${itemIdx}`);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isColorSelected) {
                          setPixel("");
                        }
                      }}
                      onClick={() => {
                        isEditMode && handlePixelSelect(idx, itemIdx, resItem);
                      }}
                      style={{
                        backgroundColor: resItem.hex,
                        aspectRatio: 1 / widthHeightRatio,
                      }}
                      className={`${styles.colorCell} ${
                        curColor
                          ? resItem.colorName == curColor.colorName
                            ? styles.activeColor
                            : styles.mutedColor
                          : curColorClicked === `${idx},${itemIdx}`
                          ? styles.activeColor
                          : ""
                      } ${borderStyle}`}
                    >
                      {curColorClicked === `${idx},${itemIdx}` && (
                        <div className={styles.editToolbox}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurColorClicked("");
                            }}
                            className={styles.editToolboxExit}
                          >
                            x
                          </button>
                          <section className="detailContainer">
                            <ColorSwatch
                              color={resItem.hex}
                              size={20}
                            ></ColorSwatch>
                          </section>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </section>
  );
}
