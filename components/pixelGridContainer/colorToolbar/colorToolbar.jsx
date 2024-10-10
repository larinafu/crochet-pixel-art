import Image from "next/image";
import collapse from "@/public/icons/angle-bottom-icon.svg";
import expand from "@/public/icons/angle-top-icon.svg";
import { PixelsContext } from "@/utils/contexts/pixelsContext";
import { useContext, useState } from "react";
import colors from "@/utils/colors2.json";
import { motion, AnimatePresence } from "framer-motion";

import ColorSwatch from "../../general/colorSwatch/colorSwatch";
import styles from "./colorToolbar.module.css";
import SinglePixelInfo from "./singlePixelInfo/singlePixelInfo";
import { Nuosu_SIL } from "next/font/google";

const NUM_RECENTLY_USED = 15;

export default function ColorToolbar({
  curPixelHovered,
  toolOptions,
  colorCounter,
}) {
  const activeColorsByFreq = Object.entries(colorCounter).sort(
    (c1, c2) => c2[1] - c1[1]
  );

  const pixelsContext = useContext(PixelsContext);

  const [isToolbarExpanded, setToolbarExpanded] = useState(false);

  const [colorPalette, setColorPalette] = useState(
    activeColorsByFreq
      .map(([colorName, _]) => colorName)
      .slice(0, NUM_RECENTLY_USED)
  );

  const [curColorHovered, setCurColorHovered] = useState(null);

  const selectedPixels = pixelsContext.pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true);

  const pixelInfoBox = (() => {
    if (curColorHovered) {
      return <SinglePixelInfo colorHex={colors[curColorHovered]} />;
    } else if (curPixelHovered) {
      return (
        <SinglePixelInfo
          pixel={
            pixelsContext.pixels[curPixelHovered.rowNum][
              curPixelHovered.stitchNum
            ]
          }
        />
      );
    } else {
      return <SinglePixelInfo pixel={null} />;
    }
  })();

  const handlePaletteSelection = (colorName) => {
    if (!colorPalette.includes(colorName)) {
      let newPalette = [
        colorName,
        ...colorPalette.slice(0, NUM_RECENTLY_USED - 1),
      ];
      setColorPalette(newPalette);
    }
    if (toolOptions.select.subOptions.pixelSelect) {
      pixelsContext.pixelsDispatch({
        type: "multi_pixel_selection_color_change",
        selectedPixels: selectedPixels,
        newColorName: colorName,
      });
    } else if (toolOptions.select.subOptions.colorSelect) {
      pixelsContext.pixelsDispatch({
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
                onMouseEnter={() => setCurColorHovered(colorName)}
                onMouseLeave={() => setCurColorHovered(null)}
              >
                <ColorSwatch size={25} color={colorHex} hover />
              </button>
            ))}
          </div>
        )}
        <div className={`detailContainer ${styles.colorPickerToolbar}`}>
          <h5>recently used</h5>
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
                  <ColorSwatch size={"100%"} color={colorName} hover />
                </button>
              ))}
            </div>
            <button
              className={`smallBtn ${styles.expand}`}
              onClick={() => {
                setToolbarExpanded(!isToolbarExpanded);
              }}
              title="expand"
            >
              {isToolbarExpanded ? (
                <Image src={collapse} alt="collapse" draggable={false} />
              ) : (
                <Image src={expand} alt="expand" draggable={false} />
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
