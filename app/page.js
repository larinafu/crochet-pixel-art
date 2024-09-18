"use client";
import { useState, useRef } from "react";
import TextButton from "./components/general/textButton/textButton";
import PixelGridContainer from "./components/pixelGridContainer/pixelGridContainer";
import styles from "./page.module.css";

export default function Home() {

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
            Knitting and Crochet Pixel Art Generator Tool
          </h1>
          <h2 className={styles.heading}>
            Pixelate any image for your next yarn creation.
          </h2>
          <form
            className={styles.imgUploadForm}
            onSubmit={(e) => {
              e.preventDefault();
              if (imageInfo[0]) {
                setShowGridTools(true);
              }
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
              accept="image/jpg, image/jpeg, image/png, image/heic"
              onChange={(e) => {
                handleFileUpload(e);
              }}
            />
            <div className={`detailContainer ${styles.imgUploadContainer}`}>
              {imageInfo?.[0] && (
                <img
                  className={styles.uploadedImg}
                  src={imageInfo[0]}
                  alt="uploaded image"
                />
              )}
            </div>

            <TextButton className={styles.uploadBtn} disabled={!imageInfo[0]}>
              Generate grid!
            </TextButton>
          </form>
        </>
      )}
    </main>
  );
}
