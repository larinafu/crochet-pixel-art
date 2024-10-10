import { courier } from "@/utils/fonts";

import ColorSwatch from "../../../general/colorSwatch/colorSwatch";

import styles from "./singlePixelInfo.module.css";

export default function SinglePixelInfo({ pixel, colorHex }) {
  return (
    <section className={`detailContainer ${styles.container}`}>
      {pixel && (
        <>
          <p>
            row <span className={courier.className}>{pixel.rowNum + 1}</span>
          </p>
          <p>
            stitch <span className={courier.className}>{pixel.stitchNum + 1}</span>
          </p>
        </>
      )}
      {pixel && (
        <div className={styles.colorContainer}>
          <ColorSwatch size={20} color={pixel.colorHex} />
          <p className={styles.hex}>
            <strong>{pixel.colorHex}</strong>
          </p>
        </div>
      )}
      {colorHex && (
        <div className={styles.singleColorContainer}>
          <ColorSwatch size={20} color={colorHex} />
          <p className={styles.hex}>
            <strong>{colorHex}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
