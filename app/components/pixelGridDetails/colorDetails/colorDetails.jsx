import { useContext, useState, useTransition } from "react";
import ColorSwatch from "@/app/components/colorSwatch/colorSwatch";
import ColorInput from "./colorInput/colorInput";
import colors from "@/app/utils/colors2.json";
import styles from "./colorDetails.module.css";
import { ModeContext } from "@/app/utils/ModeContext";

export default function ColorDetails({
  detectedColors,
  setCurColor,
  replacePixelsWithSelectedColor,
}) {
  const [isPending, startTransition] = useTransition();
  const isEditMode = useContext(ModeContext);
  const [colorSelected, setColorSelected] = useState(null);
  const [colorReplacer, setColorReplacer] = useState(null);
  const [colorTooltip, setColorTooltip] = useState(null);

  const numActiveColors = Object.keys(detectedColors).filter(
    (colorName) => detectedColors[colorName].count !== 0
  ).length;

  const colorNames = Object.keys(detectedColors)
    .sort((c1, c2) => {
      const colorOrder = Object.keys(colors);
      return colorOrder.indexOf(c1) - colorOrder.indexOf(c2);
    })
    .filter((colorName) => detectedColors[colorName].count > 0);

  const unusedColors = Object.keys(detectedColors)
    .sort((c1, c2) => {
      const colorOrder = Object.keys(colors);
      return colorOrder.indexOf(c1) - colorOrder.indexOf(c2);
    })
    .filter((colorName) => detectedColors[colorName].count === 0);

  const handleColorClick = (color) => {
    const newColor = { ...detectedColors[color], colorName: color };
    colorSelected ? setColorReplacer(newColor) : setColorSelected(newColor);
  };

  return (
    <>
      <section className="detailContainer">
        <h3>Colors</h3>
        <h4>Active Colors</h4>
        {colorNames.map((color) => {
          const isDisabled = detectedColors[color].count === 0;
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
                    ...detectedColors[color],
                    colorName: color,
                  });
                  startTransition(() => {
                    setCurColor({ ...detectedColors[color], colorName: color });
                  });
                }}
                onMouseLeave={() => {
                  setColorTooltip(null);
                  startTransition(() => {
                    setCurColor(null);
                  });
                }}
                onClick={() => {
                  if (isEditMode) handleColorClick(color);
                }}
              >
                <ColorSwatch
                  size={20}
                  color={color}
                  hover={!isDisabled}
                  fadedOut={isDisabled}
                />
              </div>
            </div>
          );
        })}
        <h4>Unused Colors</h4>
        {unusedColors.map((color) => {
          const isDisabled = detectedColors[color].count === 0;
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
                    ...detectedColors[color],
                    colorName: color,
                  });
                  setCurColor({ ...detectedColors[color], colorName: color });
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
                  hover={!isDisabled}
                  fadedOut={isDisabled}
                />
              </div>
            </div>
          );
        })}
      </section>
      {isEditMode && (
        <section className="detailContainer">
          <p>Replace all:</p>
          <div className={styles.colorSwitchContainer}>
            <p className={styles.colorSwapperName}>
              {colorSelected && (
                <>
                  {colorSelected.colorName} ({colorSelected.count})
                </>
              )}
            </p>
            <ColorInput
              color={colorSelected?.colorName}
              handleClick={() => {
                setColorSelected(null);
              }}
            />
            <div className={styles.arrowContainer}>
              <p>with</p>
              <div>{"->"}</div>
            </div>
            <ColorInput
              color={colorReplacer?.colorName}
              handleClick={() => {
                setColorReplacer(null);
              }}
            />
            <p className={styles.colorSwapperName}>
              {colorReplacer && (
                <>
                  {colorReplacer.colorName} ({colorReplacer.count})
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setColorSelected(null);
              setColorReplacer(null);
            }}
          >
            exit
          </button>
          <button
            type="button"
            disabled={!colorSelected || !colorReplacer}
            onClick={() => {
              replacePixelsWithSelectedColor(colorSelected, colorReplacer);
              setColorSelected(null);
              setColorReplacer(null);
            }}
          >
            replace!
          </button>
        </section>
      )}
    </>
  );
}
