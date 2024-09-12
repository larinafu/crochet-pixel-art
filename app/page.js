"use client";
import { useState, useRef } from "react";
import TextButton from "./components/general/textButton/textButton";
import PixelGridContainer from "./components/pixelGridContainer/pixelGridContainer";
import styles from "./page.module.css";

export default function Home() {
  console.log("home rerendered");
  const inputRef = useRef(null);
  const [imageInfo, setImageInfo] = useState([null, ""]);
  const [showGridTools, setShowGridTools] = useState(false);
  function handleFileUpload(e) {
    const imageFile = inputRef.current.files[0];
    if (imageFile) {
      setImageInfo([URL.createObjectURL(imageFile), e.target.value]);
    }
  }
  return (
    <main className={styles.main}>
      {showGridTools ? (
        <PixelGridContainer key={imageInfo[1]} curImg={imageInfo[0]} />
      ) : (
        <>
          <h1 className={styles.heading}>
            Knitting/Crochet Pixel Art Generator
          </h1>
          <form
            className={styles.imgUploadForm}
            onSubmit={(e) => {
              e.preventDefault();
              setShowGridTools(true);
            }}
          >
            <label className={styles.label} htmlFor="image_uploads">
              upload image
            </label>

            <input
              ref={inputRef}
              type="file"
              id="image_uploads"
              name="image_uploads"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                handleFileUpload(e);
              }}
            />
            <div className={styles.imgUploadContainer}>
              {imageInfo && (
                <img className={styles.uploadedImg} src={imageInfo[0]} />
              )}
            </div>

            <TextButton disabled={!imageInfo[0]}>
              Generate grid!
            </TextButton>
          </form>
        </>
      )}
    </main>
  );
}
