import EditingBlockContainer from "../../../general/editingBlockContainer/editingBlockContainer";

import styles from "./pixelEditingBlock.module.css";

export default function PixelEditingBlock({
  pixel,
  pixelsDispatch,
}) {
  return (
    <EditingBlockContainer
      colorName={pixel.colorName}
      colorHex={pixel.colorHex}
      handleExitBtnClick={() => {
        pixelsDispatch({ type: "single_pixel_deselection", pixel: pixel });
      }}
      handleColorPaletteSelection={(newColorName) => {
        pixelsDispatch({
          type: "single_pixel_selection_color_change",
          pixel: pixel,
          newColorName: newColorName,
        });
      }}
    >
      <div>
        <p>
          Row {pixel.rowNum}, Stitch {pixel.stitchNum}
        </p>
      </div>
    </EditingBlockContainer>
  );
}
