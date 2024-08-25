import ColorSwatch from "../../colorSwatch/colorSwatch";
import colors from "@/app/utils/colors2.json";

import styles from "./singlePixelInfo.module.css";

export default function SinglePixelInfo({ faded, pixel, colorName }) {
  return (
    <section className={`detailContainer ${styles.container}`}>
      {pixel ? (
        <>
          <p>
            row {pixel.rowNum} stitch {pixel.stitchNum}
          </p>
          <p>{pixel.colorName}</p>
          <ColorSwatch size={20} color={pixel.colorHex} emphasized={!faded} />
        </>
      ) : (
        <>
          <p>{colorName}</p>
          <ColorSwatch size={20} color={colors[colorName]} emphasized={!faded} />
        </>
      )}
    </section>
  );
}
