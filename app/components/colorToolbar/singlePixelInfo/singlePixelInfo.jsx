import ColorSwatch from "../../colorSwatch/colorSwatch";

import styles from "./singlePixelInfo.module.css";

export default function SinglePixelInfo({ faded, pixel }) {
  return (
    <section className={`detailContainer ${styles.container}`}>
      {pixel && (
        <>
          <p>
            row {pixel.rowNum} stitch {pixel.stitchNum}
          </p>
          <p>{pixel.colorName}</p>
          <ColorSwatch
            size={20}
            color={pixel.colorHex}
            emphasized={!faded}
          />
        </>
      )}
    </section>
  );
}
