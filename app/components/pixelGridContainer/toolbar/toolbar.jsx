import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";

import TextButton from "../../general/textButton/textButton";

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
    toolOption === toolSelections.selectionOption ? styles.active : "";
  const numSelectedPixels = pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true).length;
  return (
    <section className="detailContainer">
      <h3>Edit Options</h3>
      <div className={styles.optionsContainer}>
        <TextButton
          className={addBtnStyle("multi_pixel_select")}
          handleClick={() => {
            handleClick(() =>
              setToolSelections({
                ...toolSelections,
                selectionOption: "multi_pixel_select",
              })
            );
          }}
        >
          select by pixel
        </TextButton>
        <TextButton
          className={addBtnStyle("single_color_select")}
          handleClick={() => {
            handleClick(() =>
              setToolSelections({
                ...toolSelections,
                selectionOption: "single_color_select",
              })
            );
          }}
        >
          select by color
        </TextButton>
        <TextButton
          className={addBtnStyle("row_preview_select")}
          handleClick={() => {
            setToolSelections({
              ...toolSelections,
              selectionOption: "row_preview_select",
            });
          }}
        >
          highlight row
        </TextButton>
        <TextButton
          handleClick={() => {
            handleClick();
          }}
          disabled={!numSelectedPixels}
        >
          clear all selections
          {numSelectedPixels ? ` (${numSelectedPixels})` : ""}
        </TextButton>
      </div>
    </section>
  );
}
