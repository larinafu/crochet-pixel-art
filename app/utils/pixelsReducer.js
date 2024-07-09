import colors from "./colors2.json";

export function pixelsReducer(pixels, action) {
  switch (action.type) {
    case "refresh_pixels":
      return action.pixels;
    case "single_pixel_color_change":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...pixels[action.pixel.rowNum][action.pixel.stitchNum],
          hex: colors[action.newColorName],
          colorName: action.newColorName,
        })
      );
    case "multi_pixel_color_change":
      break;
    case "single_pixel_selection":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...action.pixel,
          checked: true,
        })
      );
    case "multi_pixel_color_selection":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorName === action.colorName) {
            return { ...pixel, colorChecked: true };
          } else return pixel;
        })
      );
    case "multi_pixel_color_deselection":
      return pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorName === action.colorName) {
            return { ...pixel, colorChecked: false };
          } else return pixel;
        })
      );
    case "single_pixel_deselection":
      return pixels.with(
        action.pixel.rowNum,
        pixels[action.pixel.rowNum].with(action.pixel.stitchNum, {
          ...action.pixel,
          checked: false,
        })
      );
    case "deselect_all_pixels":
      break;
  }
}
