import { act } from "react";
import ColorEditingBlock from "./colorEditingBlock/colorEditingBlock";
import styles from "./colorEditor.module.css";

export default function ColorEditor({
  selectedColors,
  setSelectedColors,
  pixelsDispatch,
  activeColorCounter,
}) {
  return (
    <section>
      <h2>Selected Colors ({selectedColors.length})</h2>
      {selectedColors.map((colorName) => (
        <ColorEditingBlock
          key={colorName[0]}
          colorName={colorName[0]}
          stitchCount={activeColorCounter[colorName[0]]}
          hex={colorName[1]}
          setSelectedColors={setSelectedColors}
          selectedColors={selectedColors}
          pixelsDispatch={pixelsDispatch}
        />
      ))}
    </section>
  );
}
