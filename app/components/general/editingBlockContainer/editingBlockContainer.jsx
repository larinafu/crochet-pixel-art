import ColorSwatch from "../colorSwatch/colorSwatch";

import { useState } from "react";

import styles from "./editingBlockContainer.module.css";
import ColorPalette from "../../pixelGridContainer/colorPalette/colorPalette";

export default function EditingBlockContainer({
  colorName,
  colorHex,
  children,
  handleExitBtnClick,
  handleColorPaletteSelection,
  handleColorPaletteOpen,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [colorPaletteShown, setColorPaletteShown] = useState(false);
  const [previewColor, setPreviewColor] = useState([colorName, colorHex]);
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
        <div
          className={styles.colorDetails}
          onClick={() => {
            setColorPaletteShown(!colorPaletteShown);
            if (!colorPaletteShown && handleColorPaletteOpen) {
              handleColorPaletteOpen();
            }
          }}
        >
          <span>
            <ColorSwatch color={previewColor[1]} size={20} />
          </span>
          <p>{previewColor[0]}</p>
        </div>
        {children}
      </div>
      {colorPaletteShown && (
        <div className={styles.colorPalette}>
          {
            <ColorPalette
              colorName={colorName}
              colorHex={colorHex}
              handleColorPaletteSelection={handleColorPaletteSelection}
              setColorPaletteShown={setColorPaletteShown}
              setPreviewColor={setPreviewColor}
            />
          }
        </div>
      )}
    </>
  );
}
