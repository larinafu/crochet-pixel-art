import { useState, useEffect, useRef } from "react";

export function useImageData(curImg) {
  const [imgDim, setImgDim] = useState(null);
  const [imgData, setImgData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (curImg) {
      const img = new Image();
      img.onload = () => {
        if (!imgDim) {
          setImgDim({
            height: img.height,
            width: img.width,
          });
        } else {
          ctx.drawImage(img, 0, 0);
          setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
      };
      img.src = curImg;
    }
  }, [imgDim, curImg]);

  return [imgDim, imgData, canvasRef];
}
