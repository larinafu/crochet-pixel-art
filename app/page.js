"use client";
import { useState, useRef, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import imageCompression from "browser-image-compression";

import TextButton from "./components/general/textButton/textButton";
import PixelGridContainer from "./components/pixelGridContainer/pixelGridContainer";

import styles from "./page.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const inputRef = useRef(null);
  const [imageInfo, setImageInfo] = useState([null, ""]);
  const [showGridTools, setShowGridTools] = useState(false);
  const handleFileUpload = async (e) => {
    const imageFile = inputRef.current.files[0];
    if (imageFile) {
      console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
      console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        setImageInfo([URL.createObjectURL(compressedFile), e.target.value]);
        // setImageInfo([URL.createObjectURL(imageFile), e.target.value]);
      } catch (error) {
        console.log(error);
      }
    }
    // if (imageFile) {
    //   setImageInfo([URL.createObjectURL(imageFile), e.target.value]);
    // }
  };
  return (
    <main className={styles.main}>
      <ToastContainer position="top-right" autoClose="5000" />
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
