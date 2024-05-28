import colors from './colors2.json';

export function pixelsReducer(pixels, action) {
    switch (action.type) {
        case "refresh_pixels":
            return action.pixels;
        case "single_pixel_color_change":
            return pixels.with(action.row, pixels[row].with(action.stitch, {
                ...pixels[action.row][action.stitch],
                hex: colors[action.newColorName],
                colorName: action.newColorName
            }))
        case "multi_pixel_color_change":
            break;
    }

}