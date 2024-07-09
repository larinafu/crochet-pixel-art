import { useContext, useState, useTransition } from "react";
import ColorSwatch from "@/app/components/colorSwatch/colorSwatch";
import ColorInput from "./colorInput/colorInput";
import colors from "@/app/utils/colors2.json";
import styles from "./colorDetails.module.css";
import { ModeContext } from "@/app/utils/ModeContext";

export default function ColorDetails({
  detectedColors,
  setCurColor,
  activeColorCounter,
}) {
  console.log("colorDetails rerendered");
  const [isPending, startTransition] = useTransition();
  const isEditMode = useContext(ModeContext);
  const [colorSelected, setColorSelected] = useState(null);
  const [colorReplacer, setColorReplacer] = useState(null);
  const [colorTooltip, setColorTooltip] = useState(null);

  let activeColors = [];
  let unactiveColors = [];

  for (const colorName in colors) {
    if (colorName in activeColorCounter) {
      activeColors.push([colorName, activeColorCounter[colorName]]);
    } else unactiveColors.push(colorName);
  }

  const handleColorClick = (color) => {
    const newColor = { ...detectedColors[color], colorName: color };
    colorSelected ? setColorReplacer(newColor) : setColorSelected(newColor);
  };

  return (
    <>
      <section className="detailContainer">
        <h3>Colors</h3>
        {isEditMode && <h4>Active Colors</h4>}
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
                      ...detectedColors[colorName],
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
                onClick={() => {
                  if (isEditMode) handleColorClick(colorName);
                }}
              >
                <ColorSwatch
                  size={20}
                  color={colors[colorName]}
                  hover={true}
                />
              </div>
            </div>
          );
        })}
        {isEditMode && (
          <>
            <h4>Unused Colors</h4>
            {unactiveColors.map((color) => {
              return (
                <div className={styles.colorAndTooltipContainer} key={color}>
                  {colorTooltip && colorTooltip.colorName === color && (
                    <div className={styles.colorTooltip}>
                      <h4>{colorTooltip.colorName}</h4>
                      <p>stitch count: {colorTooltip.count}</p>
                    </div>
                  )}
                  <div
                    className={styles.colorContainer}
                    onMouseEnter={() => {
                      setColorTooltip({
                        colorName: color,
                        count: 0,
                      });
                      setCurColor({
                        ...detectedColors[color],
                        colorName: color,
                      });
                    }}
                    onMouseLeave={() => {
                      setColorTooltip(null);
                      setCurColor(null);
                    }}
                    onClick={() => {
                      if (isEditMode) handleColorClick(color);
                    }}
                  >
                    <ColorSwatch
                      size={20}
                      color={color}
                      hover={false}
                      fadedOut={true}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
    </>
  );
}
