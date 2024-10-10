import colors from "@/utils/colors2.json";
import { useState } from "react";
import EditingBlockContainer from "../../../general/editingBlockContainer/editingBlockContainer";

import styles from "./colorEditingBlock.module.css";

export default function ColorEditingBlock({
  colorName,
  colorHex,
  stitchCount,
  pixelsDispatch,
}) {
  const [isColorReplacerOpen, setColorReplacerOpen] = useState(false);
  return (
    <EditingBlockContainer
      colorHex={colorHex}
      colorName={colorName}
      handleColorPaletteSelection={(newColorName) => {}}
      handleExitBtnClick={() => {}}
      handleColorPaletteOpen={() => {
        pixelsDispatch({
          type: "multi_pixel_color_selection",
          colorName: colorName,
        });
      }}
    >
      <p>stitch count: {stitchCount}</p>
      <button
        onClick={() => {
          setColorReplacerOpen(true);
          pixelsDispatch({
            type: "multi_pixel_color_selection",
            colorName: colorName,
          });
        }}
        disabled={isColorReplacerOpen}
      >
        Replace all with another color
      </button>
    </EditingBlockContainer>
  );
}
