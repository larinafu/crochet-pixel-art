import { useImageData } from "@/app/utils/useImageData";
import { useEffect } from "react";
import { findClosestColor } from "@/app/utils/colorConverter";
import colors from "@/app/utils/colors2.json";
import styles from "./pixelGrid.module.css";

export default function PixelGrid({ numStitches, imgDim, imgData, numRows }) {
  console.log("pixelGrid rerendered");
  const nearestColor = require("nearest-color").from(colors);
  const pixelRatio = ((imgDim && imgDim.width) || 0) / numStitches;
  const pixels = generatePixels(pixelRatio, imgData);
  const cellSize =
    600 /
    (pixels && pixels.length > pixels[0].length ? pixels.length : numStitches);

  function getColorIndicesForCoord(x, y) {
    const red = y * (imgDim.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  function generatePixels(pixelRatio, imgData) {
    if (imgDim && imgData) {
      const pixelGrid = [];
      for (let yInterval = 0; yInterval < numRows; yInterval += 1) {
        let pixelRow = [];
        for (let xInterval = 0; xInterval < numStitches; xInterval += 1) {
          pixelRow.push({
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            numPixels: 0,
            rgb: null,
          });
        }
        pixelGrid.push(pixelRow);
      }
      for (let yCoord = 0; yCoord < imgDim.height; yCoord += 1) {
        for (let xCoord = 0; xCoord < imgDim.width; xCoord += 1) {
          const [r, g, b, a] = getColorIndicesForCoord(xCoord, yCoord);
          const [yIndex, xIndex] = [
            Math.floor(yCoord / pixelRatio),
            Math.floor(xCoord / pixelRatio),
          ];
          if (yIndex < numRows) {
            pixelGrid[yIndex][xIndex].r += imgData.data[r];
            pixelGrid[yIndex][xIndex].g += imgData.data[g];
            pixelGrid[yIndex][xIndex].b += imgData.data[b];
            pixelGrid[yIndex][xIndex].a += imgData.data[a];
            pixelGrid[yIndex][xIndex].numPixels += 1;
          }
        }
      }
      return pixelGrid.map((pixelRow) =>
        pixelRow.map((pixelObj) => ({
          ...pixelObj,
          rgb: nearestColor({
            r: pixelObj.r / pixelObj.numPixels,
            g: pixelObj.g / pixelObj.numPixels,
            b: pixelObj.b / pixelObj.numPixels,
          }).value,
        }))
      );
    }
    return null;
  }

  return (
    <>
      <table className={styles.pixelGrid}>
        <tbody>
          {pixels &&
            pixels.map((resRow, idx) => {
              return (
                <tr key={idx}>
                  {resRow.map((resItem, itemIdx) => (
                    <td
                      key={itemIdx}
                      style={{
                        // backgroundColor: resItem.rgb,
                        backgroundColor: `rgb(${
                          resItem.r / resItem.numPixels
                        },${resItem.g / resItem.numPixels},${
                          resItem.b / resItem.numPixels
                        })`,
                        height: "10px",
                        width: cellSize,
                        height: cellSize,
                      }}
                    ></td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
