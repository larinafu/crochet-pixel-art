import colors from "@/app/utils/colors2.json";
import ColorSwatch from "../colorSwatch/colorSwatch";

import styles from "./colorPalette.module.css";

const TOP_COLOR_NUM = 10;

export default function ColorPalette({
  colorName,
  colorHex,
  handleColorPaletteSelection,
  setColorPaletteShown,
  setPreviewColor,
}) {
  const findXClosestColors = (x) => {
    const colorsRemaining = structuredClone(colors);
    delete colorsRemaining[colorName];
    const closestColors = [];
    for (let step = 0; step < x; step++) {
      const nearestColor = require("nearest-color").from(colorsRemaining);
      const closestColor = nearestColor(colorHex);
      closestColors.push(closestColor);
      delete colorsRemaining[closestColor.name];
    }
    return closestColors;
  };
  const topClosestColors = findXClosestColors(TOP_COLOR_NUM);
  return (
    <div className="detailContainer">
      <p>
        <em>suggested</em>
      </p>
      {topClosestColors.map((color) => (
        <span
          key={color.name}
          className={styles.colorOption}
          onMouseEnter={() => {
            setPreviewColor([color.name, color.value]);
          }}
          onMouseLeave={() => {
            setPreviewColor([colorName, colorHex]);
          }}
          onClick={() => {
            handleColorPaletteSelection(color.name);
            setColorPaletteShown(false);
          }}
        >
          <ColorSwatch color={color.value} size={20} />
        </span>
      ))}
      <p>----</p>
      <div className={styles.allColorOptionsContainer}>
        {Object.entries(colors).map(([key, val]) => (
          <span
            key={key}
            className={styles.colorOption}
            onMouseEnter={() => {
              setPreviewColor([key, val]);
            }}
            onMouseLeave={() => {
              setPreviewColor([colorName, colorHex]);
            }}
            onClick={() => {
              handleColorPaletteSelection(key);
              setColorPaletteShown(false);
            }}
          >
            <ColorSwatch color={val} size={20}></ColorSwatch>
          </span>
        ))}
      </div>
    </div>
  );
}
