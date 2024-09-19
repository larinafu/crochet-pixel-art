import { useEffect, useReducer, useRef, useState, useTransition } from "react";
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
import PixelGridOpt from "./pixelGridOpt/pixelGridOpt";

const PIXELGRID_CONTAINER_HEIGHT = 90;
const PIXELGRID_CONTAINER_WIDTH = 50;

export default function PixelGridContainer({ curImg }) {
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
    if (imgData && imgDim) {
      const fetchData = async () => {
        try {
          const res = await fetch("/api", {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: JSON.stringify({
              numStitches: numStitches,
              imgData: imgData,
              numRows: numRows,
              numStitches: numStitches,
              pixelsPerRow: pixelsPerRow,
              pixelsPerStitch: pixelsPerStitch,
              imgDim: imgDim,
            }),
          });
          if (res) {
            const data = await res.json();
            const pixels = data.grid;
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
            setMaxPixelSize((m) => Math.max(m, initialPixelSize));
            setLastAction("done");
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
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
    setLastAction("");
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
      {!lastAction && <p>loading...</p>}
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
                  <PixelGridOpt
                    key={`${pixelSize}-${numStitches}`}
                    curPixelHovered={curPixelHovered}
                    setCurPixelHovered={setCurPixelHovered}
                    curRow={curRow}
                    setCurRow={setCurRow}
                    widthHeightRatio={widthHeightRatio}
                    toolSelections={toolSelections}
                    pixelSize={pixelSize}
                    gridContainerRef={gridContainerRef}
                  />
                  {/* <PixelGrid
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
                  /> */}
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
