import colors from './colors.json';

export const findClosestColor = (r, g, b) => {
    console.log(colors);
    let curMin = Infinity;
    let curColor = undefined;
    for (const color of colors) {
        const [r2, g2, b2] = color.rgb.match(/\d+/g);
        const distanceSq = (
            Math.pow(r - r2, 2) +
            Math.pow(g - g2, 2) +
            Math.pow(b - b2, 2)
          )
        if (distanceSq < curMin) {
            curColor = [color.name, color.hex];
            curMin = distanceSq;
        }
    }
    return curColor
}