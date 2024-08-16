import colors from "./colors2.json";

export function pixelsReducer(pixels, action) {
  switch (action.type) {
    case "refresh_pixels":
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
    case "pixel_selection":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...action.pixel,
          singleSelected: true,
        })
      );
    case "color_selection":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorHex === action.colorHex) {
            return { ...pixel, singleSelected: true };
          } else return { ...pixel, singleSelected: false };
        })
      );
    case "color_deselection":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorHex === action.colorHex) {
            return { ...pixel, singleSelected: false };
          } else return pixel;
        })
      );
    case "pixel_deselection":
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
