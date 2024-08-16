import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";

import PixelEditingBlock from "./pixelEditingBlock/pixelEditingBlock";

import styles from "./pixelEditor.module.css";

export default function PixelEditor({
  colorCounter,
}) {
  console.log(`pixelEditor rerendered`);
  const [pixels, pixelsDispatch] = useContext(PixelsContext);

  const pixelsSelected = pixels.flat().filter((pixel) => pixel.singleSelected);
  return (
    <section className={`detailContainer ${styles.pixelEditorContainer}`}>
      <h3>Selected Pixel{pixelsSelected.length > 1 ? "s" : ""}</h3>
      <ul className={styles.selectedPixelsContainer}>
        {pixelsSelected?.map((pixel) => (
          <li key={`${pixel.rowNum},${pixel.stitchNum},${pixel.colorName}`}>
            <PixelEditingBlock
              pixel={pixel}
              pixelsDispatch={pixelsDispatch}
              colorCounter={colorCounter}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
