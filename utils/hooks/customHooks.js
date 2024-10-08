import { useCallback, useState, useEffect, useRef } from "react";

export function useImageData(curImg) {
  const [imgDim, setImgDim] = useState(null);
  const [imgData, setImgData] = useState(null);
  const canvasRef = useRef(null);
  const [canvasNode, setCanvasNode] = useState(null);
  const onChange = useCallback((node) => {
    if (node) {
      setCanvasNode(node);
    }
  }, []);

  useEffect(() => {
    if (canvasNode && curImg) {
      const canvas = canvasNode;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
  }, [imgDim, curImg, canvasNode]);

  return [imgData, imgDim, canvasRef, onChange];
}
