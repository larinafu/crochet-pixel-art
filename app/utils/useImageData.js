import { useState, useEffect, useRef, useLayoutEffect } from "react";

export function useImageData(curImg) {
  const [imgDim, setImgDim] = useState(null);
  console.log(`imgDimHeight is ${imgDim && imgDim.height}`)
  const [imgData, setImgData] = useState(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    console.log("in effect");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (curImg) {
      const img = new Image();
      img.onload = () => {
        if (!imgDim) {
          console.log("imgDim set");
          setImgDim({
            height: img.height,
            width: img.width,
          });
          console.log(`imgDimHeight is ${imgDim && imgDim.height}`)
        } else {
          ctx.drawImage(img, 0, 0);
          setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      };
      img.src = curImg;
      return () => console.log("out of effect");
    }
  }, [imgDim, curImg]);

  return [imgDim, imgData, canvasRef];
}
