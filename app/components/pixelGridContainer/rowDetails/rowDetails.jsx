import Image from "next/image";
import { useContext } from "react";
import { PixelsContext } from "@/app/utils/context";
import rightArrow from "@/public/icons/arrow-long-right-icon.svg";
import ColorSwatch from "../../general/colorSwatch/colorSwatch";
import downArrow from "@/public/icons/round-black-bottom-arrow-icon.svg";
import upArrow from "@/public/icons/round-black-top-arrow-icon.svg";
import downArrowActive from "@/public/icons/round-gold-bottom-arrow-icon.svg";
import { Courier_Prime } from "next/font/google";

import NumberContainer from "../../general/numberContainer/numberContainer";

import styles from "./rowDetails.module.css";

const courier = Courier_Prime({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

// const upArrow = () => 

export default function RowDetails({
  curRow,
  setCurRow,
  toolSelections,
  setToolSelections,
}) {
  console.log("row details rerendered");
  const [pixels, _] = useContext(PixelsContext);
  let rowColors = [];
  for (const pixel of pixels[curRow]) {
    if (
      rowColors.length !== 0 &&
      rowColors[rowColors.length - 1].colorName === pixel.colorHex
    ) {
      rowColors[rowColors.length - 1].count += 1;
    } else {
      rowColors.push({ colorName: pixel.colorHex, count: 1 });
    }
  }

  return (
    <section className={`${styles.container} detailContainer`}>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <h3 className={styles.rowNumberLabel}>
            <strong>Row</strong>
          </h3>
          <div className={styles.rowController}>
            <NumberContainer number={curRow} />
            <button
              className={styles.arrowBtn}
              onClick={() => {
                curRow > 0 && setCurRow(curRow - 1);
                setToolSelections({ ...toolSelections, highlightRow: true });
              }}
            >
              <Image width={25} src={upArrow} alt="up arrow" />
            </button>
            <button
              className={styles.arrowBtn}
              onClick={() => {
                curRow < pixels.length - 1 && setCurRow(curRow + 1);
                setToolSelections({ ...toolSelections, highlightRow: true });
              }}
            >
              <Image
                width={25}
                src={downArrow}
                alt="down arrow"
              />
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
        <div className={styles.subHeader}>
          <h4>Color Order</h4>
          <h4>
            from left <Image src={rightArrow} width={20} alt="right arrow" />{" "}
            right
          </h4>
        </div>
      </div>
      <ul className={`detailContainer ${styles.colorList}`}>
        {rowColors.map((segment, idx) => (
          <li key={idx}>
            <ColorSwatch color={segment.colorName} size={20} />
            <p>
              <span className={courier.className}>{segment.count}</span>{" "}
              <strong>{segment.colorName}</strong>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
