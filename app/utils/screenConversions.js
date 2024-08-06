export const pxToVw = (px) => (100 * px) / window.innerWidth;

export const pxToVh = (px) => (100 * px) / window.innerHeight;

export const vwToPx = (vw) => (window.innerWidth * vw) / 100;

export const vhToPx = (vh) => (window.innerHeight * vh) / 100;
