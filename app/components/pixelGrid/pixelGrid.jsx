import { useImageData } from "@/app/utils/useImageData";
import { useEffect, useState, useLayoutEffect } from "react";
import { findClosestColor } from "@/app/utils/colorConverter";
import colors from "@/app/utils/colors2.json";
import styles from "./pixelGrid.module.css";

export default function PixelGrid({
  numStitches,
  imgDim,
  imgData,
  numRows,
  detectedColors,
  setDetectedColors,
}) {
  console.log("pixelGrid rerendered");
  const pixelRatio = ((imgDim && imgDim.width) || 0) / numStitches;
  const [pixels, setPixels] = useState(null);
  let cellSize =
    600 /
    (pixels && pixels.length > pixels[0].length ? pixels.length : numStitches);

  useLayoutEffect(() => {
    setPixels(
      generatePixels(
        pixelRatio,
        imgData,
        Object.keys(detectedColors).length === 0 ? colors : detectedColors
      )
    );
  }, [imgData, numStitches]);

  useEffect(() => {
    setDetectedColors(generateColors(pixels))
  }, [pixels])

  function getColorIndicesForCoord(x, y) {
    const red = y * (imgDim.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  function generateColors(pixels) {
    let colorsFound = {};
    if (pixels) {
      for (const pixelRow of pixels) {
        for (const pixel of pixelRow) {
          if (!(pixel.colorName in colorsFound))
            colorsFound[pixel.colorName] = pixel.hex;
        }
      }
    }
    console.log(`colorsfound is ${Object.keys(colorsFound)}`);
    return colorsFound;
  }

  function generatePixels(pixelRatio, imgData, colors) {
    const nearestColor = require("nearest-color").from(colors);
    if (imgDim && imgData && colors) {
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
        pixelRow.map((pixel) => {
          const colorMatch = nearestColor({
            r: pixel.r / pixel.numPixels || 0,
            g: pixel.g / pixel.numPixels || 0,
            b: pixel.b / pixel.numPixels || 0,
          });
          const [hex, colorName] = [colorMatch.value, colorMatch.name];
          return {
            ...pixel,
            hex: hex,
            colorName: colorName,
          };
        })
      );
    }
    return null;
  }

  function generatePixelsGivenSpecifiedColors() {}

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
                        backgroundColor: resItem.hex,
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
