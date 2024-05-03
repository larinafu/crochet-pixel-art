"use client";
import { useState, useRef } from "react";
import PixelGridContainer from "./components/pixelGridContainer/pixelGridContainer";
import styles from "./page.module.css";

export default function Home() {
  console.log("home rerendered");
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("no_image");
  function handleFileUpload(e) {
    setFileName(e.target.value);
    const imageFile = inputRef.current.files[0];
    if (imageFile) {
      setImage(URL.createObjectURL(imageFile));
    }
  }
  return (
    <main className={styles.main}>
      <h1>Knitting/Crochet Pixel Art Generator</h1>
      <form className={styles.imageUploadForm}>
        <label htmlFor="image_uploads">Upload your image</label>
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
      </form>
      <PixelGridContainer key={fileName} curImg={image} />
    </main>
  );
}
