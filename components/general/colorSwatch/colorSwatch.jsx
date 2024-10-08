import styles from "./colorSwatch.module.css";
export default function ColorSwatch({
  color,
  size,
  hover,
  fadedOut,
  emphasized,
  children,
  empty,
}) {
  const customStyles = {
    backgroundColor: color,
    width: size,
    aspectRatio: 1,
  };
  if (fadedOut) {
    customStyles.opacity = "50%";
  }
  if (empty) {
    customStyles.border = ".1rem dotted gray";
    customStyles.backgroundColor = "#fff";
  }
  return (
    <div
      className={`${
        hover || emphasized ? styles.swatchWithHover : styles.swatch
      }`}
      style={customStyles}
    >
      {children}
    </div>
  );
}
