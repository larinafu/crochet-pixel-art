import Image from "next/image";
import { useContext } from "react";
import { PixelsContext } from "@/app/utils/context";
import rightArrow from "@/public/icons/arrow-long-right-icon.svg";
import ColorSwatch from "../../general/colorSwatch/colorSwatch";
import downArrow from "@/public/icons/round-black-bottom-arrow-icon.svg";
import downArrowHover from "@/public/icons/round-hover-bottom-arrow-icon.svg";
import upArrow from "@/public/icons/round-black-top-arrow-icon.svg";
import upArrowHover from "@/public/icons/round-hover-top-arrow-icon.svg";

import SvgIconButton from "../../general/svgIcons/svgIconButton/svgIconButton";
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
            <SvgIconButton
              icon={upArrow}
              hoverIcon={upArrowHover}
              handleClick={() => {
                curRow > 0 && setCurRow(curRow - 1);
                setToolSelections({ ...toolSelections, highlightRow: true });
              }}
              size={25}
              alt="up arrow"
            />
            <SvgIconButton
              icon={downArrow}
              hoverIcon={downArrowHover}
              handleClick={() => {
                curRow < pixels.length - 1 && setCurRow(curRow + 1);
                setToolSelections({ ...toolSelections, highlightRow: true });
              }}
              size={25}
              alt="down arrow"
            />
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
