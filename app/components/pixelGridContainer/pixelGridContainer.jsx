import { useEffect, useState } from "react";
import { useImageData } from "@/app/utils/useImageData";
import PixelGrid from "../pixelGrid/pixelGrid";
import PixelGridEditor from "../pixelGridEditor/pixelGridEditor";
import styles from "./pixelGridContainer.module.css";
import colors from "@/app/utils/colors2.json";

export default function PixelGridContainer({ curImg }) {
  console.log("pixelGridContainer rerendered");
  const [imgDim, imgData, canvasRef] = useImageData(curImg);
  const [numStitches, setNumStitches] = useState(30);
  const [detectedColors, setDetectedColors] = useState(colors);
  const pixelsPerStich = imgDim && imgDim.width / numStitches;
  const numRows = Math.floor(imgDim && imgDim.height / pixelsPerStich);


  return (
    <section className={styles.pixelGridContainer}>
      <canvas
        height={imgDim && imgDim.height}
        width={imgDim && imgDim.width}
        ref={canvasRef}
        className={styles.uploadedImageCanvas}
      ></canvas>
      <PixelGridEditor
        numStitches={numStitches}
        setNumStitches={setNumStitches}
        imgDim={imgDim}
        detectedColors={detectedColors}
        setDetectedColors={setDetectedColors}
      />
      <PixelGrid
        numStitches={numStitches}
        imgData={imgData}
        imgDim={imgDim}
        numRows={numRows}
        detectedColors={detectedColors}
        setDetectedColors={setDetectedColors}
      />
    </section>
  );
}
