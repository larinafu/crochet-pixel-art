import colors from "@/app/utils/colors2.json";

import ColorSwatch from "../colorSwatch/colorSwatch";

import { useState } from "react";

import styles from "./editingBlockContainer.module.css";
import ColorPalette from "../colorPalette/colorPalette";

export default function EditingBlockContainer({
  colorPaletteSelectionDispatchType,
  handleExitBtnClick,
  pixel,
  pixelsDispatch,
  setSelectedColors,
  selectedColors,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [colorPaletteShown, setColorPaletteShown] = useState(false);
  const [previewColor, setPreviewColor] = useState([
    pixel.colorName,
    pixel.hex,
  ]);
  return (
    <>
      <div
        className={`detailContainer ${styles.editingBlockContainer}`}
        onMouseEnter={() => {
          setIsFocused(true);
        }}
        onMouseLeave={() => {
          setIsFocused(false);
        }}
      >
        <button className={styles.exitBtn} onClick={handleExitBtnClick}>
          X
        </button>
        <div className={styles.header}>
          <p>
            Row {pixel.rowNum}, Stitch {pixel.stitchNum}
          </p>
        </div>
        <div
          className={styles.colorDetails}
          onClick={() => {
            setColorPaletteShown(!colorPaletteShown);
          }}
        >
          <span>
            <ColorSwatch color={previewColor[1]} size={20} />
          </span>
          <p>{previewColor[0]}</p>
        </div>
        <button
          onClick={() => {
            setSelectedColors([
              ...selectedColors,
              [pixel.colorName, pixel.hex],
            ]);
          }}
          disabled={selectedColors.some(
            (color) => color[0] === pixel.colorName
          )}
          className={styles.selectAllBtn}
        >
          add to selected colors
        </button>
      </div>
      {colorPaletteShown && (
        <div className={styles.colorPalette}>
          {
            <ColorPalette
              colorName={pixel.colorName}
              colorHex={pixel.hex}
              colorPaletteSelectionDispatchType={
                colorPaletteSelectionDispatchType
              }
              pixel={pixel}
              pixelsDispatch={pixelsDispatch}
              setColorPaletteShown={setColorPaletteShown}
              setPreviewColor={setPreviewColor}
            />
          }
        </div>
      )}
    </>
  );
}
