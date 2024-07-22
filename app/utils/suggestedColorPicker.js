import colors from "./colors2.json";

const suggestedColorPicker = (pixelGrid, pixel, suggestedColorNum) => {
  const [gridLength, gridWidth] = [pixelGrid.length, pixelGrid[0].length];
  const colorsRemaining = structuredClone(colors);
  delete colorsRemaining[pixel.colorName];
  const closestColors = [];

  const seen = new Set();

  for (const [x, y] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]) {
    const [newRow, newStitch] = [pixel.rowNum + x, pixel.stitchNum + y];
    if (
      0 <= newRow &&
      newRow < gridLength &&
      0 <= newStitch &&
      newStitch < gridWidth &&
      pixelGrid[newRow][newStitch].colorHex !== pixel.colorHex &&
      !seen.has(pixelGrid[newRow][newStitch].colorHex)
    ) {
      seen.add(pixelGrid[newRow][newStitch].colorHex);
      const nearbyColor = pixelGrid[newRow][newStitch];
      closestColors.push({
        colorName: nearbyColor.colorName,
        colorHex: nearbyColor.colorHex,
      });
      delete colorsRemaining[nearbyColor.colorName];
    }
  }

  const spotsLeftover = suggestedColorNum - closestColors.length;
  for (let step = 0; step < spotsLeftover; step++) {
    const nearestColor = require("nearest-color").from(colorsRemaining);
    const closestColor = nearestColor(pixel.colorHex);
    closestColors.push({
      colorName: closestColor.name,
      colorHex: closestColor.value,
    });
    delete colorsRemaining[closestColor.name];
  }
  return closestColors;
};

export default suggestedColorPicker;
