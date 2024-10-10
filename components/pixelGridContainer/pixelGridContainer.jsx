"use client";

import colors from "@/utils/colors2.json";
import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { pixelsReducer } from "@/utils/reducers/pixelsReducer";
import { useImmerReducer } from "use-immer";
import {
  toolOptionsReducer,
  defaultToolOptions,
} from "@/utils/reducers/toolSelectionReducer";
import { useImageData } from "@/utils/hooks/customHooks";
import { PixelsContext, PixelsProvider } from "@/utils/contexts/pixelsContext";
import { vhToPx, vwToPx } from "@/utils/screenConversions";
import { generateNewPixelGrid } from "@/utils/generatePixelGrid";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { saveNewProject } from "@/firebase/db";

import RowDetails from "./rowDetails/rowDetails";
import ColorToolbar from "./colorToolbar/colorToolbar";
import Toolbar from "./toolbar/toolbar";
import GaugeDetails from "./gaugeDetails/gaugeDetails";
import SizeDetails from "./sizeDetails/sizeDetails";
import ZoomDetails from "./zoomDetails/zoomDetails";
import ColorDetails from "./colorDetails/colorDetails";
import ImageViewbox from "./imageViewbox/imageViewbox";
import PixelGridOpt from "./pixelGridOpt/pixelGridOpt";

import styles from "./pixelGridContainer.module.css";
import TextButton from "../general/buttons/textButton/textButton";
import Link from "next/link";

const PIXELGRID_CONTAINER_HEIGHT = 90;
const PIXELGRID_CONTAINER_WIDTH = 50;

export default function PixelGridContainer() {
  const pixelsContext = useContext(PixelsContext);
  const [pixels, pixelsDispatch, imgData, imgDim, canvasRef, curImg, onChange] =
    [
      pixelsContext.pixels,
      pixelsContext.pixelsDispatch,
      pixelsContext.imgData,
      pixelsContext.imgDim,
      pixelsContext.canvasRef,
      pixelsContext.curImg,
      pixelsContext.onChange,
    ];
  const gridContainerRef = useRef(null);
  useEffect(() => {
    console.log(canvasRef);
  }, [canvasRef.current]);
  const [numStitches, setNumStitches] = useState(60);
  const [swatch, setSwatch] = useState({
    width: 30,
    height: 30,
  }); // width, height
  const [curRow, setCurRow] = useState(0);
  const [curPixelHovered, setCurPixelHovered] = useState(null);

  const [toolOptions, toolOptionsDispatch] = useImmerReducer(
    toolOptionsReducer,
    defaultToolOptions
  );
  const [gridContainerDim, setGridContainerDim] = useState({});
  const [pixelSize, setPixelSize] = useState(0);
  const [maxPixelSize, setMaxPixelSize] = useState(40);
  const [gridScrollPos, setGridScrollPos] = useState({
    top: 0,
    left: 0,
  });
  const widthHeightRatio = swatch.width / swatch.height;
  const pixelsPerStitch = imgDim?.width / numStitches;
  const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
  const numRows = Math.floor(imgDim?.height / pixelsPerRow);
  const colorCounter = useMemo(() => {
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
  }, [pixels]);

  const [gridWidth, gridHeight] = [
    numStitches * pixelSize,
    numRows * pixelSize * widthHeightRatio,
  ];

  // generate grid when img data collected
  useEffect(() => {
    if (imgData && imgDim) {
      const initialPixelSize =
        Math.ceil(
          Math.min(
            (vhToPx(PIXELGRID_CONTAINER_HEIGHT) / numRows) *
              (1 / widthHeightRatio),
            vwToPx(PIXELGRID_CONTAINER_WIDTH) / numStitches
          ) / 5
        ) * 5 || 0;
      setPixelSize(initialPixelSize);
      setMaxPixelSize((m) => Math.max(m, initialPixelSize));
    }
  }, [widthHeightRatio]);

  useEffect(() => {
    const handleResize = () => {
      if (gridContainerRef.current) {
        const windowRef = gridContainerRef.current.children[0].children[0];
        const gridRef = windowRef.children[0];
        if (gridRef) {
          const windowDim = windowRef.getBoundingClientRect();
          const gridDim = gridRef?.getBoundingClientRect();
          setGridContainerDim({
            viewableGridHeightPercent:
              Math.min(1, windowDim.height / gridHeight) * 100,
            viewableGridWidthPercent:
              Math.min(1, windowDim.width / gridWidth) * 100,
            viewableGridTopPercent:
              ((windowDim.top - gridDim.top) / gridHeight) * 100,
            viewableGridLeftPercent:
              ((windowDim.left - gridDim.left) / gridWidth) * 100,
          });
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gridContainerRef.current, gridHeight, gridWidth]);

  function handleStitchChange(stitchNum) {
    const widthHeightRatio = swatch.width / swatch.height;
    const pixelsPerStitch = imgDim?.width / stitchNum;
    const pixelsPerRow = pixelsPerStitch * widthHeightRatio;
    const numRows = Math.floor(imgDim?.height / pixelsPerRow);
    setCurRow(0);
    setNumStitches(stitchNum);
    pixelsDispatch({
      type: "refreshPixels",
      pixels: generateNewPixelGrid({
        imgData: imgData,
        swatch: swatch,
        numStitches: stitchNum,
        imgDim: imgDim,
      }),
    });
  }

  function handleGaugeChange(swatch) {
    let maxStitches = Math.min(150, imgDim.width);
    const maxStitchesWithRowLimit = Math.floor(
      (imgDim?.width * (swatch.width / swatch.height) * maxStitches) /
        imgDim?.height
    );
    maxStitches = Math.min(maxStitches, maxStitchesWithRowLimit);
    setNumStitches(Math.min(numStitches, maxStitches));
    setSwatch(swatch);
    setCurRow(0);
    pixelsDispatch({
      type: "refreshPixels",
      pixels: generateNewPixelGrid({
        imgData: imgData,
        swatch: swatch,
        numStitches: numStitches,
        imgDim: imgDim,
      }),
    });
  }

  return (
    <>
      <canvas
        height={imgDim && imgDim.height}
        width={imgDim && imgDim.width}
        ref={onChange}
        className={styles.uploadedImageCanvas}
      ></canvas>
      {pixels && (
        <>
          <section className={styles.pixelGridContainer}>
            <div className={styles.leftPanel}>
              <TextButton>
                <Link href="/">Back to home</Link>
              </TextButton>
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
                toolOptions={toolOptions}
                toolOptionsDispatch={toolOptionsDispatch}
              />
              <PixelGridOpt
                key={`${pixelSize}-${numStitches}-${widthHeightRatio}`}
                curPixelHovered={curPixelHovered}
                setCurPixelHovered={setCurPixelHovered}
                curRow={curRow}
                setCurRow={setCurRow}
                gridScrollPos={gridScrollPos}
                setGridScrollPos={setGridScrollPos}
                widthHeightRatio={widthHeightRatio}
                toolOptions={toolOptions}
                pixelSize={pixelSize}
                gridContainerRef={gridContainerRef}
                gridWidth={gridWidth}
                gridHeight={gridHeight}
                gridContainerDim={gridContainerDim}
              />
              <ColorToolbar
                curPixelHovered={curPixelHovered}
                toolOptions={toolOptions}
                colorCounter={colorCounter}
              />
            </div>
            <div className={styles.rightPanel}>
              <ImageViewbox
                curImg={curImg}
                gridContainerDim={gridContainerDim}
                setGridContainerDim={setGridContainerDim}
                gridScrollPos={gridScrollPos}
                setGridScrollPos={setGridScrollPos}
              />
              <RowDetails
                curRow={curRow}
                setCurRow={setCurRow}
                toolOptions={toolOptions}
                toolOptionsDispatch={toolOptionsDispatch}
              />
              <TextButton
                handleClick={() => saveNewProject(pixels)}
              >
                Save Project
              </TextButton>
            </div>
          </section>
          <section className={styles.userOptions}></section>
        </>
      )}
    </>
  );
}
