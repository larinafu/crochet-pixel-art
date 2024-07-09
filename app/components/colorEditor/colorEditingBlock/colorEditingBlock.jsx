import { useState } from "react";
import ColorPalette from "../../colorPalette/colorPalette";
import ColorSwatch from "../../colorSwatch/colorSwatch";
import EditingBlockContainer from "../../editingBlockContainer/editingBlockContainer";

import styles from "./colorEditingBlock.module.css";

export default function ColorEditingBlock({
  colorName,
  hex,
  stitchCount,
  setSelectedColors,
  selectedColors,
  pixelsDispatch,
}) {
  const [isColorReplacerOpen, setColorReplacerOpen] = useState(false);
  return (
    <>
      <div className="detailContainer">
        <button
          onClick={() => {
            pixelsDispatch({
              type: "multi_pixel_color_deselection",
              colorName: colorName,
            });
            setSelectedColors(
              selectedColors.filter((color) => color[0] !== colorName)
            );
          }}
        >
          x
        </button>
        <ColorSwatch color={hex} size={20} />
        <p>{colorName}</p>
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
        {isColorReplacerOpen && (
          <ColorPalette
            colorName={pixel.colorName}
            colorHex={pixel.hex}
            pixel={pixel}
            pixelsDispatch={pixelsDispatch}
            setColorPaletteShown={setColorPaletteShown}
            setPreviewColor={setPreviewColor}
          />
        )}
      </div>
      <EditingBlockContainer
        colorPaletteSelectionDispatchType="multi_pixel_color_selection"
        handleExitBtnClick={() => {
          pixelsDispatch({
            type: "multi_pixel_color_deselection",
            colorName: colorName,
          });
          setSelectedColors(
            selectedColors.filter((color) => color[0] !== colorName)
          );
        }}
        pixel={pixel}
      />
    </>
  );
}
