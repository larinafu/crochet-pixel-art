import { PixelsContext } from "@/app/utils/context";
import suggestedColorPicker from "@/app/utils/suggestedColorPicker";
import { useContext, useState } from "react";
import colors from "@/app/utils/colors2.json";
import { motion, AnimatePresence } from "framer-motion";

import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./colorToolbar.module.css";
import SinglePixelInfo from "./singlePixelInfo/singlePixelInfo";

const HIGHEST_FREQ_COLORS_NUM = 10;
const NUM_RECENTLY_USED = 5;

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

  const [colorPalette, setColorPalette] = useState({
    main: activeColorsByFreq
      .map(([colorName, _]) => colorName)
      .slice(0, HIGHEST_FREQ_COLORS_NUM),
    recentlyUsed: [],
  });

  const availSpotsLeft = [];
  for (
    let i = 0;
    i < NUM_RECENTLY_USED - colorPalette.recentlyUsed.length;
    i++
  ) {
    availSpotsLeft.push(<ColorSwatch size={25} empty />);
  }
  const selectedPixels = pixels
    .flat()
    .filter((pixel) => pixel.singleSelected === true);

  const pixelInfoBox = (() => {
    if (selectedPixels.length > 0) {
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
    if (!colorPalette.recentlyUsed.includes(colorName)) {
      let recentlyUsed = [...colorPalette.recentlyUsed, colorName];
      if (recentlyUsed.length > NUM_RECENTLY_USED) {
        recentlyUsed.shift();
      }
      setColorPalette({
        ...colorPalette,
        recentlyUsed: recentlyUsed,
      });
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
    <section className={styles.container}>
      {pixelInfoBox}
      <div className={`detailContainer ${styles.colorPickerToolbar}`}>
        <div className={styles.colorOptions}>
          <h5>
            <em>recently used</em>
          </h5>
          <div className={styles.palette}>
            <div className={styles.main}>
              {colorPalette.main.map((colorName) => (
                <button
                  className={styles.color}
                  key={`${colors[colorName]}-main`}
                  onClick={() => {
                    handlePaletteSelection(colorName);
                  }}
                >
                  <ColorSwatch size={25} color={colors[colorName]} hover />
                </button>
              ))}
            </div>
            <div className={styles.divider}></div>
            <div className={styles.recentlyUsedContainer}>
              <div className={styles.recentlyUsed}>
                {colorPalette.recentlyUsed.map((colorName) => (
                  <button
                    className={styles.color}
                    key={`${colors[colorName]}-frequent`}
                    onClick={() => {
                      handlePaletteSelection(colorName);
                    }}
                  >
                    <ColorSwatch size={25} color={colors[colorName]} hover />
                  </button>
                ))}
                {availSpotsLeft}
              </div>
            </div>
          </div>
          {isToolbarExpanded && (
            <div className={styles.expandedColors}>
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
        </div>
        <button
          onClick={() => {
            setToolbarExpanded(!isToolbarExpanded);
          }}
        >
          m
        </button>
      </div>
    </section>
  );
}
