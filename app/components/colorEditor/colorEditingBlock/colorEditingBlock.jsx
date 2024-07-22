import colors from "@/app/utils/colors2.json";
import { useState } from "react";
import EditingBlockContainer from "../../editingBlockContainer/editingBlockContainer";

import styles from "./colorEditingBlock.module.css";

export default function ColorEditingBlock({
  colorName,
  colorHex,
  stitchCount,
  setSelectedColors,
  selectedColors,
  pixelsDispatch,
}) {
  const [isColorReplacerOpen, setColorReplacerOpen] = useState(false);
  return (
    <EditingBlockContainer
      colorHex={colorHex}
      colorName={colorName}
      handleColorPaletteSelection={(newColorName) => {
        pixelsDispatch({
          type: "multi_pixel_color_change_single_color_only",
          colorName: colorName,
          newColorName: newColorName,
        });

        if (selectedColors.flat().includes(newColorName)) {
          const curColorIdx = selectedColors.findIndex(
            (color) => color[0] === colorName
          );
          setSelectedColors([
            ...selectedColors.slice(0, curColorIdx),
            ...selectedColors.slice(curColorIdx + 1, selectedColors.length),
          ]);
        } else {
          setSelectedColors(
            selectedColors.with(
              [colorName, colorHex],
              [newColorName, colors[newColorName]]
            )
          );
        }
      }}
      handleExitBtnClick={() => {
        pixelsDispatch({
          type: "multi_pixel_color_deselection",
          colorName: colorName,
        });
        setSelectedColors(
          selectedColors.filter((color) => color[0] !== colorName)
        );
      }}
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
