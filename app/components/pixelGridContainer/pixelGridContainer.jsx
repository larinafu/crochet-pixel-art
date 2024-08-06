import { useReducer, useState, useTransition, useEffect, useRef } from "react";
import { pixelsReducer } from "@/app/utils/pixelsReducer";
import { useImageData } from "@/app/utils/customHooks";
import PixelGrid from "../pixelGrid/pixelGrid";
import PixelGridDetails from "../pixelGridDetails/pixelGridDetails";
import styles from "./pixelGridContainer.module.css";
import colors from "@/app/utils/colors2.json";
import { PixelsContext } from "@/app/utils/context";
import RowDetails from "../rowDetails/rowDetails";
import PixelEditor from "../pixelEditor/pixelEditor";
import ColorEditor from "../colorEditor/colorEditor";
import ColorToolbar from "../colorToolbar/colorToolbar";
import Toolbar from "../toolbar/toolbar";
import { pxToVh, pxToVw, vhToPx, vwToPx } from "@/app/utils/screenConversions";
import ImageViewbox from "../imageViewbox/imageViewbox";

const PIXELGRID_CONTAINER_PADDING = 1;
const PIXELGRID_CONTAINER_HEIGHT = 68;
const PIXELGRID_CONTAINER_WIDTH = 50;

export default function PixelGridContainer({ curImg }) {
  console.log("pixelGridContainer rerendered");
  const gridContainerRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [imgDim, imgData, canvasRef] = useImageData(curImg);
  const [numStitches, setNumStitches] = useState(30);
  const [swatch, setSwatch] = useState({
    width: 30,
    height: 30,
  }); // width, height
  const [pixels, pixelsDispatch] = useReducer(pixelsReducer, null);
  const [isPixelsNull, setIsPixelsNull] = useState(true);
  if (pixels && isPixelsNull) {
    setIsPixelsNull(false);
  }
  const [curColor, setCurColor] = useState(null);
  const [curRow, setCurRow] = useState(null);
  const [isColorSelected, setColorSelected] = useState(false);
  const [curPixelHovered, setCurPixelHovered] = useState(null);
  const [toolSelections, setToolSelections] = useState({
    // single_pixel_select, multi_pixel_select, single_color_select, row_preview_select
    selectionOption: "multi_pixel_select",
  });
  const [gridScrollPos, setGridScrollPos] = useState(0);
  const [pixelSize, setPixelSize] = useState(0);
  const [viewableGridRatios, setViewableGridRatios] = useState(null);
  const widthHeightRatio = swatch.width / swatch.height;
  const numRows = Math.floor(
    imgDim?.height /
      ((imgDim?.width / numStitches) * (swatch.width / swatch.height))
  );
  // const pixelGridContainerPadding
  let colorCounter = null;
  if (pixels) {
    colorCounter = {};
    for (const colorName of Object.keys(colors)) {
      colorCounter[colorName] = 0;
    }
    for (const pixelRow of pixels) {
      for (const pixel of pixelRow) {
        colorCounter[pixel.colorName] += 1;
      }
    }
  }

  useEffect(() => {
    const pixels = generateNewPixelGrid(colors, numStitches, widthHeightRatio);
    pixelsDispatch({ type: "refresh_pixels", pixels: pixels });
    const initialPixelSize =
      Math.ceil(
        Math.min(
          vhToPx(PIXELGRID_CONTAINER_HEIGHT) / pixels?.length,
          vwToPx(PIXELGRID_CONTAINER_WIDTH) / pixels?.[0]?.length
        ) / 5
      ) * 5;
    setPixelSize(initialPixelSize);
  }, [imgData]);

  useEffect(() => {
    if (!isPixelsNull) {
      const padding = vwToPx(PIXELGRID_CONTAINER_PADDING);
      const handleScroll = () => {
        setGridScrollPos({
          x:
            gridContainerRef.current?.scrollLeft /
            (pixelSize * pixels[0].length),
          y:
            gridContainerRef.current?.scrollTop /
            (pixelSize * widthHeightRatio * pixels.length),
        });
      };
      const handleResize = () => {
        setViewableGridRatios({
          width: Math.min(
            1,
            PIXELGRID_CONTAINER_WIDTH /
              (pxToVw(pixelSize * pixels[0].length) +
                PIXELGRID_CONTAINER_PADDING * 2)
          ),
          height: Math.min(
            1,
            PIXELGRID_CONTAINER_HEIGHT /
              pxToVh(pixelSize * widthHeightRatio * pixels.length + padding * 2)
          ),
        });
      };

      handleResize();
      handleScroll();
      window.addEventListener("resize", handleResize);
      gridContainerRef.current.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isPixelsNull, numStitches, pixelSize]);

  function handleStitchChange(stitchNum) {
    setCurRow(null);
    startTransition(() => {
      const pixels = generateNewPixelGrid(colors, stitchNum, widthHeightRatio);
      pixelsDispatch({ type: "refresh_pixels", pixels: pixels });
      setNumStitches(stitchNum);
      setCurColor(null);
    });
  }

  function handleGaugeChange(swatch) {
    startTransition(() => {
      const pixels = generateNewPixelGrid(
        colors,
        numStitches,
        swatch.width / swatch.height
      );
      pixelsDispatch({ type: "refresh_pixels", pixels: pixels });
      setSwatch(swatch);
      setCurRow(null);
    });
  }

  function generateNewPixelGrid(colors, numStitches, widthHeightRatio) {
    const nearestColor = require("nearest-color").from(colors);
    if (imgDim && imgData && colors && numStitches) {
      const pixelRatio = (imgDim.width || 0) / numStitches;
      const pixelsPerStich = imgDim.width / numStitches;
      const pixelsPerRow = pixelsPerStich * widthHeightRatio;
      const pixelRatioRows = pixelRatio * widthHeightRatio;
      const numRows = Math.floor(imgDim.height / pixelsPerRow);
      const pixelGrid = [];
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
          return {
            ...pixel,
            calculatedHex: colorMatch.value,
            calculatedColorName: colorMatch.name,
            colorHex: colorMatch.value,
            colorName: colorMatch.name,
            rowNum: rowNum,
            stitchNum: stitchNum,
            singleSelected: false,
            colorChecked: false,
          };
        })
      );
      return pixelGridWithColors;
    }
    return null;
  }

  function getColorIndicesForCoord(x, y) {
    const red = y * (imgDim.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  return (
    <>
      <canvas
        height={imgDim && imgDim.height}
        width={imgDim && imgDim.width}
        ref={canvasRef}
        className={styles.uploadedImageCanvas}
      ></canvas>
      {pixels && (
        <>
          <section className={styles.pixelGridContainer}>
            <PixelsContext.Provider value={[pixels, pixelsDispatch]}>
              <div className={styles.leftPanel}>
                <div>
                  <PixelGridDetails
                    curColor={curColor}
                    handleStitchChange={handleStitchChange}
                    numStitches={numStitches}
                    numRows={numRows}
                    setCurColor={setCurColor}
                    swatch={swatch}
                    setSwatch={setSwatch}
                    handleGaugeChange={handleGaugeChange}
                    widthHeightRatio={widthHeightRatio}
                    colorCounter={colorCounter}
                    pixelSize={pixelSize}
                    setPixelSize={setPixelSize}
                  />
                  <Toolbar
                    toolSelections={toolSelections}
                    setToolSelections={setToolSelections}
                  />
                </div>
              </div>
              <div className={styles.centerPanel}>
                <RowDetails curRow={curRow} />
                <PixelGrid
                  curPixelHovered={curPixelHovered}
                  setCurPixelHovered={setCurPixelHovered}
                  curRow={curRow}
                  setCurRow={setCurRow}
                  pixelSize={pixelSize}
                  isColorSelected={isColorSelected}
                  setColorSelected={setColorSelected}
                  curColor={curColor}
                  widthHeightRatio={widthHeightRatio}
                  isPending={isPending}
                  toolSelections={toolSelections}
                  imgData={imgData}
                  gridContainerRef={gridContainerRef}
                />
                <ColorToolbar
                  curPixelHovered={curPixelHovered}
                  toolSelections={toolSelections}
                  colorCounter={colorCounter}
                />
              </div>
              <div className={styles.rightPanel}>
                {toolSelections.selectionOption === "multi_color_select" && (
                  <ColorEditor
                    colorCounter={colorCounter}
                  />
                )}
                <PixelEditor
                  colorCounter={colorCounter}
                />
                <ImageViewbox
                  curImg={curImg}
                  viewableGridRatios={viewableGridRatios}
                  gridScrollPos={gridScrollPos}
                  pixelSize={pixelSize}
                />
              </div>
            </PixelsContext.Provider>
          </section>
          <section className={styles.userOptions}></section>
        </>
      )}
    </>
  );
}
