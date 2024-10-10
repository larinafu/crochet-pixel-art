import { PixelsContext } from "@/utils/contexts/pixelsContext";
import { useContext } from "react";

import TextButton from "../../general/buttons/textButton/textButton";
import Checkmark from "../../general/svgIcons/checkmark/checkmark";
import Dropdown from "../../general/buttons/dropdown/dropdown";

import styles from "./toolbar.module.css";

export default function Toolbar({ toolOptions, toolOptionsDispatch }) {
  const pixelsContext = useContext(PixelsContext);
  const [pixels, pixelsDispatch] = [
    pixelsContext.pixels,
    pixelsContext.pixelsDispatch,
  ];
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
          case "pixelSelect":
            if (toolSelections.singleColorSelect) {
              setToolSelections({
                ...toolSelections,
                singleColorSelect: false,
                pixelSelect: true,
              });
            } else {
              setToolSelections({
                ...toolSelections,
                pixelSelect: !toolSelections.pixelSelect,
              });
            }
            pixelsDispatch({
              type: "deselect_all_pixels",
            });
            break;
          case "singleColorSelect":
            if (toolSelections.pixelSelect) {
              setToolSelections({
                ...toolSelections,
                singleColorSelect: true,
                pixelSelect: false,
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
        {Object.keys(toolOptions).map((optionName) => (
          <Dropdown
            key={optionName}
            option={toolOptions[optionName]}
            handleChange={(subType = null) => {
              toolOptionsDispatch({ type: optionName, subType: subType });
            }}
          />
        ))}
      </div>
    </section>
  );
}
