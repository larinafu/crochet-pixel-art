import ColorSwatch from "../../../general/colorSwatch/colorSwatch";
import { Courier_Prime } from "next/font/google";

import styles from "./singlePixelInfo.module.css";

const courier = Courier_Prime({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

export default function SinglePixelInfo({ faded, pixel, colorHex }) {
  return (
    <section className={`detailContainer ${styles.container}`}>
      {pixel && (
        <>
          <p>
            row <span className={courier.className}>{pixel.rowNum}</span>
          </p>
          <p>
            stitch <span className={courier.className}>{pixel.stitchNum}</span>
          </p>
        </>
      )}
      {pixel && (
        <div className={styles.colorContainer}>
          <ColorSwatch size={20} color={pixel.colorHex} emphasized={!faded} />
          <p className={styles.hex}>
            <strong>{pixel.colorHex}</strong>
          </p>
        </div>
      )}
      {colorHex && (
        <div className={styles.singleColorContainer}>
          <ColorSwatch size={20} color={colorHex} emphasized={!faded} />
          <p className={styles.hex}>
            <strong>{colorHex}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
