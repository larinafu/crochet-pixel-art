import styles from "./colorSwatch.module.css";
export default function ColorSwatch({ color, size, hover, fadedOut, emphasized, children }) {
  return (
    <div
      className={`${hover || emphasized ? styles.swatchWithHover : styles.swatch}`}
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        opacity: fadedOut ? "50%" : 1,
      }}
    >
      {children}
    </div>
  );
}
