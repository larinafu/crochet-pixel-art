import { useState } from "react";

import ColorSwatch from "@/components/general/colorSwatch/colorSwatch";

import styles from "./colorInput.module.css";

export default function ColorInput({ color, handleClick }) {
  const [isMouseOver, setMouseOver] = useState(false);
  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      className={styles.colorSwapBtn}
    >
      <ColorSwatch size={40} color={color} fadedOut={color && isMouseOver}>
        <div className={styles.xContainer}>
          {isMouseOver && color && (
            <div className={styles.x}>
              <p>x</p>
            </div>
          )}
        </div>
      </ColorSwatch>
    </button>
  );
}
