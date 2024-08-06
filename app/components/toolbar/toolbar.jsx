import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";
import styles from "./toolbar.module.css";

export default function Toolbar({ toolSelections, setToolSelections }) {
  const [_, pixelsDispatch] = useContext(PixelsContext);
  const handleClick = (callback) => {
    callback?.();
    pixelsDispatch({
      type: "deselect_all_pixels",
    });
  };
  return (
    <section className="detailContainer">
      <h3>Edit Options</h3>
      <button
        onClick={() => {
          handleClick(() =>
            setToolSelections({
              ...toolSelections,
              selectionOption: "multi_pixel_select",
            })
          );
        }}
      >
        pixel multiselect
      </button>
      <button
        onClick={() => {
          handleClick(() =>
            setToolSelections({
              ...toolSelections,
              selectionOption: "single_color_select",
            })
          );
        }}
      >
        color select
      </button>
      <button
        onClick={() => {
          handleClick();
        }}
      >
        clear all selections
      </button>
      <button
        onClick={() => {
          setToolSelections({
            ...toolSelections,
            selectionOption: "row_preview_select",
          });
        }}
      >
        outline current row
      </button>
    </section>
  );
}
