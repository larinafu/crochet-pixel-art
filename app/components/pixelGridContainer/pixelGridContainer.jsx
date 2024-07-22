import Image from "next/image";

import { useReducer, useState, useTransition, useEffect } from "react";
import { pixelsReducer } from "@/app/utils/pixelsReducer";
import { useImageData } from "@/app/utils/useImageData";
import PixelGrid from "../pixelGrid/pixelGrid";
import PixelGridDetails from "../pixelGridDetails/pixelGridDetails";
import styles from "./pixelGridContainer.module.css";
import colors from "@/app/utils/colors2.json";
import { ModeContext, PixelsContext } from "@/app/utils/context";
import RowDetails from "../rowDetails/rowDetails";
import PixelEditor from "../pixelEditor/pixelEditor";
import ColorEditor from "../colorEditor/colorEditor";
import ColorToolbar from "../colorToolbar/colorToolbar";
import Toolbar from "../toolbar/toolbar";

export default function PixelGridContainer({ curImg }) {
  console.log("pixelGridContainer rerendered");
  const [isPending, startTransition] = useTransition();
  const [imgDim, imgData, canvasRef] = useImageData(curImg);
  const [numStitches, setNumStitches] = useState(30);
  const [swatch, setSwatch] = useState({
    width: 30,
    height: 30,
  }); // width, height
  const [detectedColors, setDetectedColors] = useState({});
  const [selectedColors, setSelectedColors] = useState([]);
  const [pixels, pixelsDispatch] = useReducer(pixelsReducer, null);
  const [selectedPixels, setSelectedPixels] = useState([]);
  const [curColor, setCurColor] = useState(null);
  const [curRow, setRow] = useState(null);
  const [isColorSelected, setColorSelected] = useState(false);
  const [colorPalette, setColorPalette] = useState([]);
  const [curPixelHovered, setCurPixelHovered] = useState(null);
  const [toolSelections, setToolSelections] = useState({
    // single_pixel_select, multi_pixel_select, single_color_select
    selectionOption: "single_pixel_select",
  });
  const widthHeightRatio = swatch.width / swatch.height;
  const numRows = Math.floor(
    imgDim?.height /
      ((imgDim?.width / numStitches) * (swatch.width / swatch.height))
  );
  let activeColorCounter = {};
  if (pixels) {
    for (const pixelRow of pixels) {
      for (const pixel of pixelRow) {
        if (pixel.colorName in activeColorCounter) {
          activeColorCounter[pixel.colorName] += 1;
        } else {
          activeColorCounter[pixel.colorName] = 1;
        }
      }
    }
  }

  useEffect(() => {
    const colorsFound =
      generateNewPixelGridWithColorDetails(
        colors,
        numStitches,
        widthHeightRatio
      ) || {};
    setDetectedColors(colorsFound);
    setColorPalette(
      Object.entries(colorsFound)
        .sort((c1, c2) => c2[1].count - c1[1].count)
        .slice(0, 10)
    );
  }, [imgData]);

  function handleStitchChange(stitchNum) {
    setSelectedPixels([]);
    setSelectedColors([]);
    startTransition(() => {
      const colorsFound = generateNewPixelGridWithColorDetails(
        colors,
        stitchNum,
        widthHeightRatio
      );
      setNumStitches(stitchNum);
      setDetectedColors(colorsFound);
      setCurColor(null);
    });
  }

  function handleGaugeChange(swatch) {
    startTransition(() => {
      const colorsFound = generateNewPixelGridWithColorDetails(
        colors,
        numStitches,
        swatch.width / swatch.height
      );
      setSwatch(swatch);
      setDetectedColors(colorsFound);
    });
  }

  function generateNewPixelGridWithColorDetails(
    colors,
    numStitches,
    widthHeightRatio
  ) {
    const nearestColor = require("nearest-color").from(colors);
    if (imgDim && imgData && colors && numStitches) {
      const pixelRatio = ((imgDim && imgDim.width) || 0) / numStitches;
      const pixelsPerStich = imgDim && imgDim.width / numStitches;
      const pixelsPerRow = pixelsPerStich * widthHeightRatio;
      const pixelRatioRows = pixelRatio * widthHeightRatio;
      const numRows = Math.floor(imgDim && imgDim.height / pixelsPerRow);
      const pixelGrid = [];
      const colorsFound = {};
      for (const [key, value] of Object.entries(colors)) {
        colorsFound[key] = {
          hex: value,
          count: 0,
        };
      }
      for (let yInterval = 0; yInterval < numRows; yInterval += 1) {
        let pixelRow = [];
        for (let xInterval = 0; xInterval < numStitches; xInterval += 1) {
          pixelRow.push({
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            numPixels: 0,
          });
        }
        pixelGrid.push(pixelRow);
      }

      for (let yCoord = 0; yCoord < imgDim.height; yCoord += 1) {
        for (let xCoord = 0; xCoord < imgDim.width; xCoord += 1) {
          const [r, g, b, a] = getColorIndicesForCoord(xCoord, yCoord);
          const [yIndex, xIndex] = [
            Math.floor(yCoord / pixelRatioRows),
            Math.floor(xCoord / pixelRatio),
          ];
          if (yIndex < numRows) {
            pixelGrid[yIndex][xIndex].r += imgData.data[r];
            pixelGrid[yIndex][xIndex].g += imgData.data[g];
            pixelGrid[yIndex][xIndex].b += imgData.data[b];
            pixelGrid[yIndex][xIndex].a += imgData.data[a];
            pixelGrid[yIndex][xIndex].numPixels += 1;
          }
        }
      }
      const pixelGridWithColors = pixelGrid.map((pixelRow, rowNum) =>
        pixelRow.map((pixel, stitchNum) => {
          const colorMatch = nearestColor({
            r: pixel.r / pixel.numPixels || 0,
            g: pixel.g / pixel.numPixels || 0,
            b: pixel.b / pixel.numPixels || 0,
          });
          const [hex, colorName] = [colorMatch.value, colorMatch.name];
          colorsFound[colorName].count += 1;
          return {
            ...pixel,
            calculatedHex: hex,
            calculatedColorName: colorName,
            colorHex: hex,
            colorName: colorName,
            rowNum: rowNum,
            stitchNum: stitchNum,
            singleSelected: false,
            colorChecked: false,
          };
        })
      );
      pixelsDispatch({ type: "refresh_pixels", pixels: pixelGridWithColors });
      return colorsFound;
    }
    return {};
  }

  function getColorIndicesForCoord(x, y) {
    const red = y * (imgDim.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  return (
    <>
      <section className={styles.pixelGridContainer}>
        <canvas
          height={imgDim && imgDim.height}
          width={imgDim && imgDim.width}
          ref={canvasRef}
          className={styles.uploadedImageCanvas}
        ></canvas>
        <PixelsContext.Provider value={[pixels, pixelsDispatch]}>
          <div className={styles.leftPanel}>
            <div>
              <PixelGridDetails
                curColor={curColor}
                detectedColors={detectedColors}
                handleStitchChange={handleStitchChange}
                imgDim={imgDim}
                numStitches={numStitches}
                numRows={numRows}
                setCurColor={setCurColor}
                swatch={swatch}
                setSwatch={setSwatch}
                handleGaugeChange={handleGaugeChange}
                widthHeightRatio={widthHeightRatio}
                activeColorCounter={activeColorCounter}
              />
              <Toolbar
                toolSelections={toolSelections}
                setToolSelections={setToolSelections}
              />
            </div>
          </div>
          <div className={styles.centerPanel}>
            <RowDetails row={curRow || []} />
            <PixelGrid
              curPixelHovered={curPixelHovered}
              setCurPixelHovered={setCurPixelHovered}
              curRow={curRow}
              setRow={setRow}
              isColorSelected={isColorSelected}
              setColorSelected={setColorSelected}
              curColor={curColor}
              widthHeightRatio={widthHeightRatio}
              isPending={isPending}
              selectedPixels={selectedPixels}
              setSelectedPixels={setSelectedPixels}
              toolSelections={toolSelections}
            />
            <ColorToolbar
              colorPalette={colorPalette}
              curPixelHovered={curPixelHovered}
              selectedPixels={selectedPixels}
              setSelectedPixels={setSelectedPixels}
              toolSelections={toolSelections}
            />
          </div>
          <div className={styles.rightPanel}>
            {toolSelections.selectionOption === "multi_color_select" && (
              <ColorEditor
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                activeColorCounter={activeColorCounter}
              />
            )}
            {toolSelections.selectionOption === "multi_pixel_select" && (
              <PixelEditor
                detectedColors={detectedColors}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedPixels={selectedPixels}
                setSelectedPixels={setSelectedPixels}
              />
            )}
            <section className="detailContainer">
              <img className={styles.imgReference} src={curImg} />
            </section>
          </div>
        </PixelsContext.Provider>
      </section>
      <section className={styles.userOptions}></section>
    </>
  );
}
