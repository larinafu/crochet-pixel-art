"use client";

import { createContext, useEffect, useReducer, useState } from "react";
import { pixelsReducer } from "../reducers/pixelsReducer";
import { useImageData } from "../hooks/customHooks";
import { generateNewPixelGrid } from "../generatePixelGrid";

export const PixelsContext = createContext(null);

export const PixelsProvider = ({ children }) => {
  const [curImg, setCurImg] = useState(null);
  const [pixels, pixelsDispatch] = useReducer(pixelsReducer, null);
  const [imgData, imgDim, canvasRef, onChange] = useImageData(curImg);
  console.log(imgData, curImg);

  useEffect(() => {
    if (window.sessionStorage.getItem("curImg")) {
      setCurImg(window.sessionStorage.getItem("curImg"));
    }
  }, []);

  useEffect(() => {
    const numStitches = 60;
    const swatch = { width: 30, height: 30 };
    if (imgData && imgDim) {
      const pixels = generateNewPixelGrid({
        numStitches: numStitches,
        imgData: imgData,
        swatch: swatch,
        imgDim: imgDim,
      });
      pixelsDispatch({ type: "refreshPixels", pixels: pixels });
    }
    console.log(canvasRef);
  }, [imgData, imgDim]);

  const value = {
    pixels: pixels,
    pixelsDispatch: pixelsDispatch,
    imgData: imgData,
    imgDim: imgDim,
    canvasRef: canvasRef,
    curImg: curImg,
    setCurImg: setCurImg,
    onChange: onChange,
  };

  return (
    <PixelsContext.Provider value={value}>{children}</PixelsContext.Provider>
  );
};
