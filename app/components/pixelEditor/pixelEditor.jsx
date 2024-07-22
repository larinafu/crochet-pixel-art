import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";

import PixelEditingBlock from "./pixelEditingBlock/pixelEditingBlock";

import styles from "./pixelEditor.module.css";

export default function PixelEditor({
  detectedColors,
  selectedColors,
  setSelectedColors,
  selectedPixels,
  setSelectedPixels,
}) {
  console.log(`pixelEditor rerendered`);
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const pixelsSelected = selectedPixels
    .map((p) => pixels[p.rowNum][p.stitchNum])
    .reverse();
  return (
    <section className={`detailContainer ${styles.pixelEditorContainer}`}>
      <h3>Selected Pixels ({pixelsSelected?.length || 0})</h3>
      <ul className={styles.selectedColorsContainer}>
        {pixelsSelected?.map((pixel) => (
          <li key={`${pixel.rowNum},${pixel.stitchNum},${pixel.colorName}`}>
            <PixelEditingBlock
              pixel={pixel}
              pixelsDispatch={pixelsDispatch}
              detectedColors={detectedColors}
              setSelectedColors={setSelectedColors}
              selectedColors={selectedColors}
              selectedPixels={selectedPixels}
              setSelectedPixels={setSelectedPixels}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
