import Image from "next/image";
import collapse from "@/public/icons/angle-bottom-icon.svg";
import expand from "@/public/icons/angle-top-icon.svg";
import { PixelsContext } from "@/app/utils/context";
import { useContext, useState } from "react";
import colors from "@/app/utils/colors2.json";
import { motion, AnimatePresence } from "framer-motion";

import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./colorToolbar.module.css";
import SinglePixelInfo from "./singlePixelInfo/singlePixelInfo";

const NUM_RECENTLY_USED = 15;

export default function ColorToolbar({
  curPixelHovered,
  toolSelections,
  colorCounter,
}) {
  const activeColorsByFreq = Object.entries(colorCounter).sort(
    (c1, c2) => c2[1] - c1[1]
  );

  const [pixels, pixelsDispatch] = useContext(PixelsContext);

  const [isToolbarExpanded, setToolbarExpanded] = useState(false);

  const [colorPalette, setColorPalette] = useState(
    activeColorsByFreq
      .map(([colorName, _]) => colorName)
      .slice(0, NUM_RECENTLY_USED)
  );

  const [curColorHovered, setCurColorHovered] = useState(null);

  const availSpotsLeft = [];
  for (let i = 0; i < NUM_RECENTLY_USED - colorPalette.length; i++) {
    availSpotsLeft.push(<ColorSwatch size={"2.6vw"} empty />);
  }
  const selectedPixels = pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true);

  const pixelInfoBox = (() => {
    if (curColorHovered) {
      return <SinglePixelInfo colorName={curColorHovered} />;
    } else if (selectedPixels.length > 0) {
      return (
        <SinglePixelInfo
          pixel={
            pixels[selectedPixels[selectedPixels.length - 1].rowNum][
              selectedPixels[selectedPixels.length - 1].stitchNum
            ]
          }
        />
      );
    } else if (curPixelHovered) {
      return (
        <SinglePixelInfo
          pixel={pixels[curPixelHovered.rowNum][curPixelHovered.stitchNum]}
          faded
        />
      );
    } else {
      return <SinglePixelInfo pixel={null} />;
    }
  })();

  const handlePaletteSelection = (colorName) => {
    if (!colorPalette.includes(colorName)) {
      let newPalette = [...colorPalette, colorName];
      if (newPalette.length > NUM_RECENTLY_USED) {
        newPalette.shift();
      }
      setColorPalette(newPalette);
    }
    switch (toolSelections.selectionOption) {
      case "multi_pixel_select":
        pixelsDispatch({
          type: "multi_pixel_selection_color_change",
          selectedPixels: selectedPixels,
          newColorName: colorName,
        });
        break;
      case "single_color_select":
        pixelsDispatch({
          type: "single_color_selection_color_change",
          newColorName: colorName,
        });
    }
  };
  return (
    <>
      <section className={styles.container}>
        {pixelInfoBox}
        {isToolbarExpanded && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`detailContainer ${styles.expandedColors}`}
          >
            {Object.entries(colors).map(([colorName, colorHex]) => (
              <button
                className={styles.color}
                key={colorHex}
                onClick={() => {
                  handlePaletteSelection(colorName);
                  setToolbarExpanded(!isToolbarExpanded);
                }}
              >
                <ColorSwatch size={25} color={colorHex} hover />
              </button>
            ))}
          </div>
        )}
        <div className={`detailContainer ${styles.colorPickerToolbar}`}>
          <h5>
            <em>recently used</em>
          </h5>
          <div className={styles.quickView}>
            <div className={styles.palette}>
              {colorPalette.map((colorName) => (
                <button
                  className={styles.color}
                  key={`${colors[colorName]}-main`}
                  onClick={() => {
                    handlePaletteSelection(colorName);
                  }}
                  onMouseEnter={() => setCurColorHovered(colorName)}
                  onMouseLeave={() => setCurColorHovered(null)}
                >
                  <ColorSwatch size={25} color={colors[colorName]} hover />
                </button>
              ))}
              {availSpotsLeft}
            </div>
            <button
              className={`smallBtn ${styles.expand}`}
              onClick={() => {
                setToolbarExpanded(!isToolbarExpanded);
              }}
              title="expand"
            >
              {isToolbarExpanded ? (
                <Image src={collapse} alt="collapse" />
              ) : (
                <Image src={expand} alt="expand" />
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
