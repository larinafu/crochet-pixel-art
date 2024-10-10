import colors from "@/utils/colors2.json";

export function pixelsReducer(pixels, action) {
  switch (action.type) {
    case "refreshPixels":
      return action.pixels;

    // changing color
    case "single_pixel_selection_color_change":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...pixels[action.pixel.rowNum][action.pixel.stitchNum],
          colorHex: colors[action.newColorName],
          colorName: action.newColorName,
        })
      );
    case "multi_pixel_selection_color_change":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (
            action.selectedPixels.some(
              (pixelLoc) =>
                pixelLoc.rowNum === pixel.rowNum &&
                pixelLoc.stitchNum === pixel.stitchNum
            )
          ) {
            return {
              ...pixel,
              colorName: action.newColorName,
              colorHex: colors[action.newColorName],
              singleSelected: false,
            };
          } else return pixel;
        })
      );
    case "single_color_selection_color_change":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.singleSelected) {
            return {
              ...pixel,
              colorName: action.newColorName,
              colorHex: colors[action.newColorName],
            };
          } else return pixel;
        })
      );

    // changing selected pixels
    case "pixelSelect":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...action.pixel,
          singleSelected: true,
        })
      );
    case "colorSelect":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorHex === action.colorHex) {
            return { ...pixel, singleSelected: true };
          } else return pixel;
        })
      );
    case "colorDeselect":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorHex === action.colorHex) {
            return { ...pixel, singleSelected: false };
          } else return pixel;
        })
      );
    case "pixelDeselect":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...action.pixel,
          singleSelected: false,
        })
      );
    case "deselect_all_pixels":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => ({ ...pixel, singleSelected: false }))
      );
  }
}
