import { NextResponse } from "next/server";
import colors from "@/app/utils/colors2.json";

const getColorIndicesForCoord = (x, y, imgDim) => {
  const red = y * (imgDim?.width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

const generateNewPixelGrid = (
  imgData,
  numRows,
  numStitches,
  pixelsPerRow,
  pixelsPerStitch,
  imgDim
) => {
  const nearestColor = require("nearest-color").from(colors);
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

  for (let yCoord = 0; yCoord < imgDim?.height; yCoord += 1) {
    for (let xCoord = 0; xCoord < imgDim?.width; xCoord += 1) {
      const [r, g, b, a] = getColorIndicesForCoord(xCoord, yCoord, imgDim);
      const [yIndex, xIndex] = [
        Math.floor(yCoord / pixelsPerRow),
        Math.floor(xCoord / pixelsPerStitch),
      ];
      if (yIndex < numRows) {
        pixelGrid[yIndex][xIndex].r += imgData?.data[r];
        pixelGrid[yIndex][xIndex].g += imgData?.data[g];
        pixelGrid[yIndex][xIndex].b += imgData?.data[b];
        pixelGrid[yIndex][xIndex].a += imgData?.data[a];
        pixelGrid[yIndex][xIndex].numPixels += 1;
      }
    }
  }
  const pixelGridWithColors = pixelGrid.map((pixelRow, rowNum) =>
    pixelRow.map((pixel, stitchNum) => {
      const colorMatch = nearestColor({
        r: pixel.r / pixel.numPixels || 0,
        g: pixel.g / pixel.numPixels || 0,
        b: pixel.b / pixel.numPixels || 0,
      });
      return {
        ...pixel,
        calculatedHex: colorMatch.value,
        calculatedColorName: colorMatch.name,
        colorHex: colorMatch.value,
        colorName: colorMatch.name,
        rowNum: rowNum,
        stitchNum: stitchNum,
        singleSelected: false,
        colorChecked: false,
      };
    })
  );
  return pixelGridWithColors;
};

// export async function GET() {
//   return NextResponse.json({
//     hello: "world",
//   });
// }

export async function POST(req) {
  const data = await req.json();
  const grid = generateNewPixelGrid(
    data.imgData,
    data.numRows,
    data.numStitches,
    data.pixelsPerRow,
    data.pixelsPerStitch,
    data.imgDim
  );
  return NextResponse.json({
    grid: grid,
  });
}
