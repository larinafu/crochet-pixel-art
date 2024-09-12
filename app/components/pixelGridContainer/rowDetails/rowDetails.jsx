import Image from "next/image";
import { useContext } from "react";
import { PixelsContext } from "@/app/utils/context";
import rightArrow from "@/public/icons/arrow-long-right-icon.svg";
import ColorSwatch from "../../general/colorSwatch/colorSwatch";
import downArrow from "@/public/icons/round-black-bottom-arrow-icon.svg";
import upArrow from "@/public/icons/round-black-top-arrow-icon.svg";

import NumberContainer from "../../general/numberContainer/numberContainer";

import styles from "./rowDetails.module.css";

export default function RowDetails({ curRow, setCurRow }) {
  console.log("row details rerendered");
  const [pixels, _] = useContext(PixelsContext);
  let rowColors = [];
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

  return (
    <section className={`${styles.container} detailContainer`}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <h3>
            Color order (from left <Image src={rightArrow} width={20} /> right)
          </h3>
          <div className={styles.rowController}>
            <p className={styles.rowNumberLabel}>
              <strong>row</strong>
            </p>
            <NumberContainer number={curRow} />
            <button onClick={() => curRow > 0 && setCurRow(curRow - 1)}>
              <Image width={25} src={upArrow} alt="up arrow" />
            </button>
            <button
              onClick={() =>
                curRow < pixels.length - 1 && setCurRow(curRow + 1)
              }
            >
              <Image width={25} src={downArrow} alt="down arrow" />
            </button>
          </div>
        </div>
        <div className={styles.colorRow}>
          {pixels[curRow]?.map((pixel, pixelIdx) => {
            return (
              <div
                className={styles.colorRec}
                key={pixelIdx}
                style={{
                  backgroundColor: pixel.colorHex,
                }}
              ></div>
            );
          })}
        </div>
      </div>
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
    </section>
  );
}
