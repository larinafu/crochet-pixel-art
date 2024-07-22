import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";
import ColorEditingBlock from "./colorEditingBlock/colorEditingBlock";
import styles from "./colorEditor.module.css";

export default function ColorEditor({
  selectedColors,
  setSelectedColors,
  activeColorCounter,
}) {
  const [_, pixelsDispatch] = useContext(PixelsContext);
  return (
    <section className="detailContainer">
      <h3>Selected Colors ({selectedColors.length})</h3>
      {selectedColors.map((colorName) => (
        <ColorEditingBlock
          key={colorName[0]}
          colorName={colorName[0]}
          stitchCount={activeColorCounter[colorName[0]]}
          colorHex={colorName[1]}
          setSelectedColors={setSelectedColors}
          selectedColors={selectedColors}
          pixelsDispatch={pixelsDispatch}
        />
      ))}
    </section>
  );
}
