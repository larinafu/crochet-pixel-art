import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./toolbar.module.css";

export default function Toolbar({ toolSelections, setToolSelections }) {
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const handleClick = (callback) => {
    callback?.();
    pixelsDispatch({
      type: "deselect_all_pixels",
    });
  };
  const addBtnStyle = (toolOption) =>
    `primaryBtn ${
      toolOption === toolSelections.selectionOption ? "primaryBtnActive" : ""
    }`;
  const btnClass = "primaryBtn";
  const numSelectedPixels = pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true).length;
  return (
    <section className="detailContainer">
      <h3>Edit Options</h3>
      <div className={styles.optionsContainer}>
        <button
          className={addBtnStyle("multi_pixel_select")}
          onClick={() => {
            handleClick(() =>
              setToolSelections({
                ...toolSelections,
                selectionOption: "multi_pixel_select",
              })
            );
          }}
        >
          select by pixel
        </button>
        <button
          className={addBtnStyle("single_color_select")}
          onClick={() => {
            handleClick(() =>
              setToolSelections({
                ...toolSelections,
                selectionOption: "single_color_select",
              })
            );
          }}
        >
          select by color
        </button>
        <button
          className={addBtnStyle("row_preview_select")}
          onClick={() => {
            setToolSelections({
              ...toolSelections,
              selectionOption: "row_preview_select",
            });
          }}
        >
          highlight row
        </button>
        <button
          className={btnClass}
          onClick={() => {
            handleClick();
          }}
          disabled={!numSelectedPixels}
        >
          clear all selections
          {numSelectedPixels ? ` (${numSelectedPixels})` : ""}
        </button>
      </div>
    </section>
  );
}
