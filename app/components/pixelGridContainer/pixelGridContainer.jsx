import {
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import { pixelsReducer } from "@/app/utils/pixelsReducer";
import { useImageData } from "@/app/utils/customHooks";
import { ActionContext } from "@/app/utils/context";
import PixelGrid from "./pixelGrid/pixelGrid";
import styles from "./pixelGridContainer.module.css";
import colors from "@/app/utils/colors2.json";
import { PixelsContext } from "@/app/utils/context";
import RowDetails from "./rowDetails/rowDetails";
import ColorToolbar from "./colorToolbar/colorToolbar";
import Toolbar from "./toolbar/toolbar";
import GaugeDetails from "./gaugeDetails/gaugeDetails";
import SizeDetails from "./sizeDetails/sizeDetails";
import ZoomDetails from "./zoomDetails/zoomDetails";
import ColorDetails from "./colorDetails/colorDetails";
import { vhToPx, vwToPx } from "@/app/utils/screenConversions";
import ImageViewbox from "./imageViewbox/imageViewbox";

const PIXELGRID_CONTAINER_HEIGHT = 90;
const PIXELGRID_CONTAINER_WIDTH = 50;

export default function PixelGridContainer({ curImg }) {
  console.log("pixelGridContainer rerendered");
  const gridContainerRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [imgData, imgDim, canvasRef] = useImageData(curImg);
  const [numStitches, setNumStitches] = useState(30);
  const [swatch, setSwatch] = useState({
    width: 30,
    height: 30,
  }); // width, height
  const [pixels, pixelsDispatch] = useReducer(pixelsReducer, null);
  const [curColor, setCurColor] = useState(null);
  const [curRow, setCurRow] = useState(0);
  const [isColorSelected, setColorSelected] = useState(false);
  const [curPixelHovered, setCurPixelHovered] = useState(null);
  const [toolSelections, setToolSelections] = useState({
    // single_pixel_select, multi_pixel_select, single_color_select, row_preview_select
    multiPixelSelect: true,
    singleColorSelect: false,
    highlightRow: false,
  });
  const [lastAction, setLastAction] = useState("");
  const [pixelSize, setPixelSize] = useState(0);
  const [maxPixelSize, setMaxPixelSize] = useState(40);
  const widthHeightRatio = swatch.width / swatch.height;
  const pixelsPerStitch = imgDim?.width / numStitches;
  const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
  const numRows = Math.floor(imgDim?.height / pixelsPerRow);
  const colorCounter = (() => {
    let colorCount = {};
    if (pixels) {
      for (const colorName of Object.keys(colors)) {
        colorCount[colorName] = 0;
      }
      for (const pixelRow of pixels) {
        for (const pixel of pixelRow) {
          colorCount[pixel.colorName] += 1;
        }
      }
    }
    return colorCount;
  })();

  // generate grid when img data collected
  useEffect(() => {
    const getColorIndicesForCoord = (x, y) => {
      const red = y * (imgDim?.width * 4) + x * 4;
      return [red, red + 1, red + 2, red + 3];
    };

    const generateNewPixelGrid = (numStitches) => {
      if (imgData) {
        const nearestColor = require("nearest-color").from(colors);
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

        for (let yCoord = 0; yCoord < imgDim?.height; yCoord += 1) {
          for (let xCoord = 0; xCoord < imgDim?.width; xCoord += 1) {
            const [r, g, b, a] = getColorIndicesForCoord(xCoord, yCoord);
            const [yIndex, xIndex] = [
              Math.floor(yCoord / pixelsPerRow),
              Math.floor(xCoord / pixelsPerStitch),
            ];
            if (yIndex < numRows) {
              pixelGrid[yIndex][xIndex].r += imgData?.data[r];
              pixelGrid[yIndex][xIndex].g += imgData?.data[g];
              pixelGrid[yIndex][xIndex].b += imgData?.data[b];
              pixelGrid[yIndex][xIndex].a += imgData?.data[a];
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
      } else {
        return null;
      }
    };
    const pixels = generateNewPixelGrid(numStitches);
    pixelsDispatch({ type: "refresh_pixels", pixels: pixels });
    const initialPixelSize =
      Math.ceil(
        Math.min(
          (vhToPx(PIXELGRID_CONTAINER_HEIGHT) / pixels?.length) *
            (1 / widthHeightRatio),
          vwToPx(PIXELGRID_CONTAINER_WIDTH) / pixels?.[0]?.length
        ) / 5
      ) * 5 || 0;
    setPixelSize(initialPixelSize);
    setMaxPixelSize(Math.max(maxPixelSize, initialPixelSize));
    setLastAction("regeneration");
  }, [
    imgData,
    imgDim,
    numStitches,
    numRows,
    pixelsPerRow,
    pixelsPerStitch,
    widthHeightRatio,
  ]);

  function handleStitchChange(stitchNum) {
    setCurRow(0);
    setNumStitches(stitchNum);
    setCurColor(null);
  }

  function handleGaugeChange(swatch) {
    let maxStitches = Math.min(200, imgDim.width);
    const maxStitchesWithRowLimit = Math.floor(
      (imgDim?.width * (swatch.width / swatch.height) * maxStitches) /
        imgDim?.height
    );
    maxStitches = Math.min(maxStitches, maxStitchesWithRowLimit);
    setNumStitches(Math.min(numStitches, maxStitches));
    setSwatch(swatch);
    setCurRow(0);
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
            <ActionContext.Provider value={setLastAction}>
              <PixelsContext.Provider value={[pixels, pixelsDispatch]}>
                <div className={styles.leftPanel}>
                  <GaugeDetails
                    handleGaugeChange={handleGaugeChange}
                    swatch={swatch}
                  />
                  <SizeDetails
                    key={`whRatio-${widthHeightRatio}`}
                    numStitches={numStitches}
                    swatch={swatch}
                    widthHeightRatio={widthHeightRatio}
                    handleStitchChange={handleStitchChange}
                    imgDim={imgDim}
                  />
                  <ZoomDetails
                    pixelSize={pixelSize}
                    setPixelSize={setPixelSize}
                    maxPixelSize={maxPixelSize}
                    key={`initSize-${pixelSize}`}
                  />
                  <ColorDetails colorCounter={colorCounter} />
                </div>
                <div className={styles.centerPanel}>
                  <Toolbar
                    toolSelections={toolSelections}
                    setToolSelections={setToolSelections}
                  />
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
                  <RowDetails
                    curRow={curRow}
                    setCurRow={setCurRow}
                    toolSelections={toolSelections}
                    setToolSelections={setToolSelections}
                  />
                  <ImageViewbox curImg={curImg} />
                </div>
              </PixelsContext.Provider>
            </ActionContext.Provider>
          </section>
          <section className={styles.userOptions}></section>
        </>
      )}
    </>
  );
}
