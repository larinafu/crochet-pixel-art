import { useContext, useState, useTransition } from "react";
import ColorSwatch from "@/app/components/colorSwatch/colorSwatch";
import ColorInput from "./colorInput/colorInput";
import colors from "@/app/utils/colors2.json";
import styles from "./colorDetails.module.css";
import { ModeContext, PixelsContext } from "@/app/utils/context";

export default function ColorDetails({ colorCounter }) {
  console.log("colorDetails rerendered");
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const [colorTooltip, setColorTooltip] = useState(null);

  let activeColors = Object.entries(colorCounter)
    .sort((c1, c2) => c2[1] - c1[1])
    .filter(([_, count]) => count > 0);

  return (
    <section className={`detailContainer ${styles.container}`}>
      <h3>Color Quick Select</h3>
      {activeColors.map(([colorName, count]) => {
        return (
          <div className={styles.colorAndTooltipContainer} key={colorName}>
            {colorTooltip?.colorName === colorName && (
              <div className={styles.colorTooltip}>
                <h4>{colorTooltip.colorName}</h4>
                <p>count: {colorTooltip.count}</p>
              </div>
            )}
            <button
              className={styles.colorBtn}
              onMouseEnter={() => {
                setColorTooltip({
                  colorName: colorName,
                  count: count,
                });
              }}
              onMouseLeave={() => {
                setColorTooltip(null);
              }}
              onClick={() => {
                pixelsDispatch({
                  type: "color_selection",
                  colorHex: colors[colorName],
                });
              }}
            >
              <ColorSwatch size={20} color={colors[colorName]} hover={true} />
            </button>
          </div>
        );
      })}
    </section>
  );
}
