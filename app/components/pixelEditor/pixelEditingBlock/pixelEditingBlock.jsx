import colors from "@/app/utils/colors2.json";

import ColorSwatch from "../../colorSwatch/colorSwatch";
import EditingBlockContainer from "../../editingBlockContainer/editingBlockContainer";

import { useState } from "react";

import styles from "./pixelEditingBlock.module.css";
import ColorPalette from "../../colorPalette/colorPalette";

export default function PixelEditingBlock({
  pixel,
  pixelsDispatch,
  setSelectedColors,
  selectedColors,
  selectedPixels,
  setSelectedPixels,
}) {
  return (
    <EditingBlockContainer
      handleExitBtnClick={() => {
        setSelectedPixels(
          selectedPixels.filter(
            ([rowNum, stitchNum]) =>
              rowNum !== pixel.rowNum || stitchNum !== pixel.stitchNum
          )
        );
        pixelsDispatch({ type: "single_pixel_deselection", pixel: pixel });
      }}
      colorPaletteSelectionDispatchType="single_pixel_color_change"
      pixel={pixel}
      pixelsDispatch={pixelsDispatch}
      setSelectedColors={setSelectedColors}
      selectedColors={selectedColors}
      selectedPixels={selectedPixels}
    />
  );
}
