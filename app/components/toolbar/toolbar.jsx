import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";
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
  const hasSelectedPixels = pixels
    .flat()
    .some((pixel) => pixel.singleSelected === true);
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
          view colors in row
        </button>
        <button
          className={btnClass}
          onClick={() => {
            handleClick();
          }}
          disabled={!hasSelectedPixels}
        >
          clear all selections
        </button>
      </div>
    </section>
  );
}
