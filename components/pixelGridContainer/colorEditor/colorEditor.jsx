import { PixelsContext } from "@/utils/contexts/pixelsContext";
import { useContext } from "react";
import ColorEditingBlock from "./colorEditingBlock/colorEditingBlock";
import styles from "./colorEditor.module.css";

export default function ColorEditor({
  colorCounter,
}) {
  const [_, pixelsDispatch] = useContext(PixelsContext);
  return (
    <section className="detailContainer">
      <h3>Selected Colors</h3>
    </section>
  );
}
