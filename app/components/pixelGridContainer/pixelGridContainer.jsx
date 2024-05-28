import {
  useDeferredValue,
  useState,
  useLayoutEffect,
  useTransition,
} from "react";
import { pixelsReducer } from "@/app/utils/pixelsReducer";
import { useImageData } from "@/app/utils/useImageData";
import PixelGrid from "../pixelGrid/pixelGrid";
import PixelGridDetails from "../pixelGridDetails/pixelGridDetails";
import styles from "./pixelGridContainer.module.css";
import colors from "@/app/utils/colors2.json";
import { ModeContext } from "@/app/utils/ModeContext";
import RowDetails from "../rowDetails/rowDetails";
import ColorEditor from "../colorEditor/colorEditor";
import PixelGridEditor from "../pixelGridEditor/pixelGridEditor";

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
  const [selectedColors, setSelectedColors] = useState({});
  const [curPixel, setPixel] = useState("");
  const [pixels, pixelsDispatch] = useReducer(pixelsReducer, null);
  const [curColor, setCurColor] = useState(null);
  const [curRow, setRow] = useState(null);
  const [isColorSelected, setColorSelected] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [colorMap, setColorMap] = useState(resetColorMap());
  const [editType, setEditType] = useState("single");
  const [pixelsSelected, setPixelsSelected] = useState({});
  const widthHeightRatio = swatch.width / swatch.height;
  const numRows = Math.floor(
    imgDim?.height /
      ((imgDim?.width / numStitches) * (swatch.width / swatch.height))
  );

  useLayoutEffect(() => {
    const colorsFound = generateNewPixelGridWithColorDetails(
      colors,
      numStitches,
      widthHeightRatio
    ) || {};
    setDetectedColors(colorsFound);
  }, [imgData]);

  function handleStitchChange(stitchNum) {
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

  function handlePixelSelect(row, column, pixelObj) {
    if (pixelObj.colorName in pixelsSelected) {
      const pixelFound = pixelsSelected[pixelObj.colorName].find(
        (obj) => obj.row === row && obj.column === column
      );
      if (pixelFound) {
        if (!pixelFound.checked) {
          setPixelsSelected({
            ...pixelsSelected,
            [pixelObj.colorName]: [
              ...pixelsSelected[pixelObj.colorName],
              { row: row, column: column, checked: true },
            ],
          });
        }
      } else {
        console.log("in here");
        setPixelsSelected({
          ...pixelsSelected,
          [pixelObj.colorName]: [
            ...pixelsSelected[pixelObj.colorName],
            { row: row, column: column, checked: true },
          ],
        });
      }
    } else {
      setPixelsSelected({
        ...pixelsSelected,
        [pixelObj.colorName]: [{ row: row, column: column, checked: true }],
      });
    }
  }

  function handleGaugeChange(swatch) {
    startTransition(() => {
      const [generatedPixelGrid, colorsFound] = generatePixels(
        colors,
        numStitches,
        swatch.width / swatch.height
      );
      setSwatch(swatch);
      setPixels(generatedPixelGrid);
      setDetectedColors(colorsFound);
    });
  }

  function toggleColorFromSelectedColors(color) {
    return color in selectedColors
      ? Object.fromEntries(
          Object.entries(selectedColors).filter(([key]) => key !== color)
        )
      : { ...selectedColors, [color]: detectedColors[color] };
  }

  function resetColorMap() {
    return Object.fromEntries(
      Object.keys(colors).map((colorName) => [colorName, colorName])
    );
  }

  function generateNewPixelGridWithColorDetails(colors, numStitches, widthHeightRatio) {
    const nearestColor = require("nearest-color").from(colors);
    if (imgDim && imgData && colors && numStitches) {
      const pixelRatio = ((imgDim && imgDim.width) || 0) / numStitches;
      const pixelsPerStich = imgDim && imgDim.width / numStitches;
      const pixelsPerRow = pixelsPerStich * widthHeightRatio;
      const pixelRatioRows = pixelRatio * widthHeightRatio;
      const numRows = Math.floor(imgDim && imgDim.height / pixelsPerRow);
      const pixelGrid = [];
      const colorsFound = Object.fromEntries(
        Object.keys(colorMap).map((colorName) => [
          colorName,
          {
            count: 0,
          },
        ])
      );
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
      const pixelGridWithColors = pixelGrid.map((pixelRow) =>
        pixelRow.map((pixel) => {
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
            hex: hex,
            colorName: colorName,
          };
        })
      );
      pixelsDispatch({type: "refresh_pixels", pixels: pixelGridWithColors})
      return colorsFound;
    }
    return {};
  }

  function replacePixelsWithSelectedColor(color, replacer) {
    const selectedColorName = color.colorName;
    const replacerName = replacer.colorName;
    const updatedColors = {
      ...detectedColors,
      [selectedColorName]: {
        ...detectedColors[selectedColorName],
        count: 0,
      },
      [replacerName]: {
        ...detectedColors[replacerName],
        count:
          detectedColors[replacerName].count +
          detectedColors[selectedColorName].count,
      },
    };
    setDetectedColors(updatedColors);
    setColorMap({ ...colorMap, [selectedColorName]: replacer });
    setPixels(
      pixels.map((pixelRow) =>
        pixelRow.map((pixel) => {
          if (pixel.colorName === selectedColorName) {
            return {
              ...pixel,
              hex: colors[replacerName],
              colorName: replacerName,
            };
          } else {
            return pixel;
          }
        })
      )
    );
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
        <ModeContext.Provider value={isEditMode}>
          <div className={styles.leftPanel}>
            <PixelGridDetails
              curColor={curColor}
              curImg={curImg}
              detectedColors={detectedColors}
              handleStitchChange={handleStitchChange}
              imgDim={imgDim}
              isEditMode={isEditMode}
              numStitches={numStitches}
              numRows={numRows}
              replacePixelsWithSelectedColor={replacePixelsWithSelectedColor}
              setCurColor={setCurColor}
              setEditMode={setEditMode}
              swatch={swatch}
              setSwatch={setSwatch}
              handleGaugeChange={handleGaugeChange}
              widthHeightRatio={widthHeightRatio}
            />
          </div>
          <div className={styles.centerPanel}>
            {isEditMode ? (
              <PixelGridEditor />
            ) : (
              <RowDetails row={curRow || []} />
            )}
            <PixelGrid
              pixels={pixels}
              curPixel={curPixel}
              setPixel={setPixel}
              curRow={curRow}
              setRow={setRow}
              isColorSelected={isColorSelected}
              setColorSelected={setColorSelected}
              curColor={curColor}
              widthHeightRatio={widthHeightRatio}
              isPending={isPending}
              handlePixelSelect={handlePixelSelect}
              pixelsSelected={pixelsSelected}
            />
          </div>
          <div className={styles.rightPanel}>
            <ColorEditor pixelsSelected={pixelsSelected} />
          </div>
        </ModeContext.Provider>
      </section>
      <section className={styles.userOptions}>
        <button
          type="button"
          onClick={() => {
            setRow(null);
            setEditMode(!isEditMode);
          }}
          className={styles.modeButton}
        >
          {isEditMode ? "Update Changes" : "Edit Project"}
        </button>
      </section>
    </>
  );
}
