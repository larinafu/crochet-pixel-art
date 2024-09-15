import { PixelsContext } from "@/app/utils/context";
import { useContext } from "react";

import TextButton from "../../general/textButton/textButton";
import Checkmark from "../../general/svgIcons/checkmark/checkmark";

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
    isActive(toolOption) ? styles.active : "";

  const isActive = (toolOption) => toolSelections[toolOption];

  const OptionButton = ({ selectionType, children }) => (
    <TextButton
      className={addBtnStyle(selectionType)}
      handleClick={() => {
        switch (selectionType) {
          case "highlightRow":
            setToolSelections({
              ...toolSelections,
              highlightRow: !toolSelections.highlightRow,
            });
            break;
          case "multiPixelSelect":
            if (toolSelections.singleColorSelect) {
              setToolSelections({
                ...toolSelections,
                singleColorSelect: false,
                multiPixelSelect: true,
              });
            } else {
              setToolSelections({
                ...toolSelections,
                multiPixelSelect: !toolSelections.multiPixelSelect,
              });
            }
            pixelsDispatch({
              type: "deselect_all_pixels",
            });
            break;
          case "singleColorSelect":
            if (toolSelections.multiPixelSelect) {
              setToolSelections({
                ...toolSelections,
                singleColorSelect: true,
                multiPixelSelect: false,
              });
            } else {
              setToolSelections({
                ...toolSelections,
                singleColorSelect: !toolSelections.singleColorSelect,
              });
            }
            pixelsDispatch({
              type: "deselect_all_pixels",
            });
            break;
        }
      }}
    >
      {children} {isActive(selectionType) ? <Checkmark size={13} /> : " "}
    </TextButton>
  );

  const numSelectedPixels = pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true).length;
  return (
    <section className={`detailContainer ${styles.container}`}>
      <h3>Edit Options</h3>
      <div className={styles.optionsContainer}>
        <OptionButton selectionType="multiPixelSelect">
          select pixels
        </OptionButton>
        <OptionButton selectionType="singleColorSelect">
          select color
        </OptionButton>
        <OptionButton selectionType="highlightRow">highlight row</OptionButton>
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
