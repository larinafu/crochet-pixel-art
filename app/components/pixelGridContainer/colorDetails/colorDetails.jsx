import { useContext, useState, useRef, useLayoutEffect } from "react";
import ColorSwatch from "@/app/components/general/colorSwatch/colorSwatch";
import colors from "@/app/utils/colors2.json";
import styles from "./colorDetails.module.css";
import { PixelsContext } from "@/app/utils/context";

export default function ColorDetails({ colorCounter }) {
  console.log("colorDetails rerendered");
  const [pixels, pixelsDispatch] = useContext(PixelsContext);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);
  const [colorTooltip, setColorTooltip] = useState(null);
  const [tooltipSide, setTooltipSide] = useState("right");
  const tooltipRightStyle = {
    left: 25,
    borderBottomLeftRadius: 0
  };

  const tooltipLeftStyle = {
    right: 25,
    borderBottomRightRadius: 0
  };

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { x: containerStart, width: containerWidth } =
        containerRef?.current?.getBoundingClientRect();
      const { x: tooltipStart, width: tooltipWidth } =
        tooltipRef?.current?.getBoundingClientRect();
      if (tooltipStart + tooltipWidth > containerStart + containerWidth) {
        setTooltipSide("left");
      }
    }
  }, [colorTooltip]);

  let activeColors = Object.entries(colorCounter)
    .sort((c1, c2) => c2[1] - c1[1])
    .filter(([_, count]) => count > 0);

  return (
    <section
      className={`detailContainer ${styles.container}`}
      ref={containerRef}
    >
      <h3>Color Quick Select</h3>
      {activeColors.map(([colorName, count]) => {
        return (
          <div className={styles.colorAndTooltipContainer} key={colorName}>
            {colorTooltip?.colorName === colorName && (
              <div
                className={styles.colorTooltip}
                ref={tooltipRef}
                style={
                  tooltipSide === "right" ? tooltipRightStyle : tooltipLeftStyle
                }
              >
                <h4>{colors[colorTooltip.colorName]}</h4>
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
                setTooltipSide("right");
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
