import PixelEditingBlock from "./pixelEditingBlock/pixelEditingBlock";

import styles from "./pixelEditor.module.css";

export default function PixelEditor({
  pixels,
  pixelsDispatch,
  detectedColors,
  selectedColors,
  setSelectedColors,
  selectedPixels,
  setSelectedPixels,
}) {
  console.log(`pixelEditor rerendered`);
  const pixelsSelected = selectedPixels
    .map(([rowNum, stitchNum]) => pixels[rowNum][stitchNum])
    .reverse();
  return (
    <section className={styles.pixelEditorContainer}>
      <h2>Selected Pixels ({pixelsSelected?.length || 0})</h2>
      <ul className={styles.selectedColorsContainer}>
        {pixelsSelected?.map((pixel) => (
          <li>
            <PixelEditingBlock
              key={`${pixel.rowNum},${pixel.stitchNum}`}
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
