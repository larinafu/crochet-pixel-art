"use client";
import { useEffect, useState, useRef } from "react";
import PixelGridContainer from "./components/pixelGridContainer/pixelGridContainer";
import styles from "./page.module.css";

export default function Home() {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("no_image");
  useEffect(() => {
    const input = inputRef.current;
    const imageFile = input.files[0];
    if (imageFile) {
      setImage(URL.createObjectURL(imageFile));
    }
  }, [fileName]);
  function handleFileUpload(e) {
    setFileName(e.target.value);
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
