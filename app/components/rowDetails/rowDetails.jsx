import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./rowDetails.module.css";
import { useContext } from "react";
import { PixelsContext } from "@/app/utils/context";

export default function RowDetails({ curRow }) {
  console.log("row details rerendered");
  const [pixels, _] = useContext(PixelsContext);
  let rowColors = [];
  if (curRow) {
    for (const pixel of pixels[curRow]) {
      if (
        rowColors.length !== 0 &&
        rowColors[rowColors.length - 1].colorName === pixel.colorName
      ) {
        rowColors[rowColors.length - 1].count += 1;
      } else {
        rowColors.push({ colorName: pixel.colorName, count: 1 });
      }
    }
  }

  return (
    <section className={`${styles.container} detailContainer`}>
      <table className={styles.colorRow}>
        <tbody>
          {curRow && (
            <tr>
              {pixels[curRow].map((pixel, pixelIdx) => {
                return (
                  <td
                    key={pixelIdx}
                    style={{
                      backgroundColor: pixel.colorHex,
                    }}
                  ></td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.colorListContainer}>
        <h3>Color order</h3>
        <h4>from left {"->"} right</h4>
        <ul className={styles.colorList}>
          {rowColors.map((segment, idx) => (
            <li key={idx}>
              <ColorSwatch color={segment.colorName} size={20} />
              <p>
                {segment.count} {segment.colorName}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
