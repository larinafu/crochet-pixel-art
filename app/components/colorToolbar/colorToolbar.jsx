import { PixelsContext } from "@/app/utils/context";
import suggestedColorPicker from "@/app/utils/suggestedColorPicker";
import { useContext } from "react";

import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./colorToolbar.module.css";
import SinglePixelInfo from "./singlePixelInfo/singlePixelInfo";

export default function ColorToolbar({
  curPixelHovered,
  selectedPixels,
  setSelectedPixels,
  colorPalette,
  toolSelections,
}) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const pixelInfo = (() => {
    if (selectedPixels.length > 0) {
      return (
        <SinglePixelInfo
          pixel={
            pixels[selectedPixels[selectedPixels.length - 1].rowNum][
              selectedPixels[selectedPixels.length - 1].stitchNum
            ]
          }
        />
      );
    } else if (curPixelHovered) {
      return (
        <SinglePixelInfo
          pixel={pixels[curPixelHovered.rowNum][curPixelHovered.stitchNum]}
          faded
        />
      );
    } else {
      return <SinglePixelInfo pixel={null} />;
    }
  })();

  const handlePaletteSelection = (colorName) => {
    switch (toolSelections.selectionOption) {
      case "single_pixel_select":
        pixelsDispatch({
          type: "single_pixel_selection_color_change",
          pixel: pixels[selectedPixels[0].rowNum][selectedPixels[0].stitchNum],
          newColorName: colorName,
        });
        break;
      case "multi_pixel_select":
        pixelsDispatch({
          type: "multi_pixel_selection_color_change",
          selectedPixels: selectedPixels,
          newColorName: colorName,
        });
        setSelectedPixels([]);
        break;
      case "single_color_select":
        pixelsDispatch({
          type: "single_color_selection_color_change",
          newColorName: colorName,
        });

    }
  };
  return (
    <section className={styles.container}>
      {pixelInfo}
      <section className={`detailContainer ${styles.colorPickerToolbar}`}>
        {colorPalette.map(([colorName, colorObj]) => (
          <button
            key={colorObj.hex}
            onClick={() => {
              handlePaletteSelection(colorName);
            }}
          >
            <ColorSwatch size={30} color={colorObj.hex} />
          </button>
        ))}
      </section>
    </section>
  );
}
