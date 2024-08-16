import { useContext, useState, useTransition } from "react";
import ColorSwatch from "@/app/components/colorSwatch/colorSwatch";
import ColorInput from "./colorInput/colorInput";
import colors from "@/app/utils/colors2.json";
import styles from "./colorDetails.module.css";
import { ModeContext } from "@/app/utils/context";

export default function ColorDetails({
  setCurColor,
  colorCounter,
}) {
  console.log("colorDetails rerendered");
  const [isPending, startTransition] = useTransition();
  const [colorSelected, setColorSelected] = useState(null);
  const [colorReplacer, setColorReplacer] = useState(null);
  const [colorTooltip, setColorTooltip] = useState(null);

  let activeColors = Object.entries(colorCounter)
    .sort((c1, c2) => c2[1] - c1[1])
    .filter(([_, count]) => count > 0);

  const handleColorClick = (color) => {
    const newColor = { ...detectedColors[color], colorName: color };
    colorSelected ? setColorReplacer(newColor) : setColorSelected(newColor);
  };

  return (
    <section className={`detailContainer ${styles.container}`}>
      <h3>Color Frequency</h3>
      {activeColors.map(([colorName, count]) => {
        return (
          <div className={styles.colorAndTooltipContainer} key={colorName}>
            {colorTooltip && colorTooltip.colorName === colorName && (
              <div className={styles.colorTooltip}>
                <h4>{colorTooltip.colorName}</h4>
                <p>stitch count: {colorTooltip.count}</p>
              </div>
            )}
            <div
              className={styles.colorContainer}
              onMouseEnter={() => {
                setColorTooltip({
                  colorName: colorName,
                  count: count,
                });
                startTransition(() => {
                  setCurColor({
                    // ...detectedColors[colorName],
                    colorName: colorName,
                  });
                });
              }}
              onMouseLeave={() => {
                setColorTooltip(null);
                startTransition(() => {
                  setCurColor(null);
                });
              }}
              // onClick={() => {
              //   handleColorClick(colorName);
              // }}
            >
              <ColorSwatch size={20} color={colors[colorName]} hover={true} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
