import styles from "./toolbar.module.css";

export default function Toolbar({ toolSelections, setToolSelections }) {
  return (
    <section className="detailContainer">
      <h3>Edit Options</h3>
      <button
        onClick={() => {
          setToolSelections({
            ...toolSelections,
            selectionOption: "single_pixel_select",
          });
        }}
      >
        pixel singleselect
      </button>
      <button
        onClick={() => {
          setToolSelections({
            ...toolSelections,
            selectionOption: "multi_pixel_select",
          });
        }}
      >
        pixel multiselect
      </button>
      <button
        onClick={() => {
          setToolSelections({
            ...toolSelections,
            selectionOption: "single_color_select",
          });
        }}
      >
        color select
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
