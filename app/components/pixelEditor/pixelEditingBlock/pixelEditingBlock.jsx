import EditingBlockContainer from "../../editingBlockContainer/editingBlockContainer";

import styles from "./pixelEditingBlock.module.css";

export default function PixelEditingBlock({
  pixel,
  pixelsDispatch,
  setSelectedColors,
  selectedColors,
  selectedPixels,
  setSelectedPixels,
}) {
  console.log(selectedPixels);
  console.log(pixel);
  return (
    <EditingBlockContainer
      colorName={pixel.colorName}
      colorHex={pixel.colorHex}
      handleExitBtnClick={() => {
        setSelectedPixels(
          selectedPixels.filter(
            (p) =>
              p.rowNum !== pixel.rowNum || p.stitchNum !== pixel.stitchNum
          )
        );
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
      <button
        onClick={() => {
          setSelectedColors([...selectedColors, [pixel.colorName, pixel.colorHex]]);
        }}
        disabled={selectedColors?.some((color) => color[0] === pixel.colorName)}
        className={styles.selectAllBtn}
      >
        add to selected colors
      </button>
    </EditingBlockContainer>
  );
}
